import {
    AuthRequest,
    CodeChallengeMethod,
    ResponseType,
} from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const ACCOUNT_URL =
    process.env.EXPO_PUBLIC_CHEFU_ACCOUNT_URL ||
    'https://myaccount.chefuinc.com';
const API_URL =
    process.env.EXPO_PUBLIC_CHEFU_API_URL ||
    process.env.EXPO_PUBLIC_CHEFU_OAUTH_ISSUER ||
    'https://api.chefuinc.com';

const CLIENT_ID = 'chefu-academy-mobile';
const REDIRECT_URI = 'chefu-academy://auth/sso';
const TOKEN_STORAGE_KEY = 'chefuAcademy.sso.tokens.v1';
const REFRESH_SKEW_SECONDS = 60;
const SCOPES = [
    'openid',
    'profile',
    'email',
    'courses:read',
    'videos:read',
    'keys:manage',
];

const secureStoreOptions: SecureStore.SecureStoreOptions = {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

const discovery = {
    authorizationEndpoint: `${API_URL.replace(/\/$/, '')}/oauth/authorize`,
    tokenEndpoint: `${API_URL.replace(/\/$/, '')}/oauth/token`,
    userInfoEndpoint: `${API_URL.replace(/\/$/, '')}/oauth/userinfo`,
};

export type CheFuSsoTokenResponse = {
    access_token: string;
    expires_in?: number;
    id_token?: string;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
};

export type CheFuSsoTokenSet = {
    accessToken: string;
    expiresAt: number | null;
    idToken?: string;
    refreshToken?: string;
    scope?: string;
    tokenType: string;
};

export type CheFuSsoUserInfo = {
    app?: string;
    email?: string;
    name?: string;
    roles?: string[];
    scope?: string;
    sub: string;
};

let inMemoryTokens: CheFuSsoTokenSet | null | undefined;
let refreshPromise: Promise<CheFuSsoTokenSet | null> | null = null;

export async function signInWithCheFuSso() {
    const request = new AuthRequest({
        clientId: CLIENT_ID,
        codeChallengeMethod: CodeChallengeMethod.S256,
        extraParams: {
            nonce: randomOauthValue(24),
        },
        redirectUri: REDIRECT_URI,
        responseType: ResponseType.Code,
        scopes: SCOPES,
        state: randomOauthValue(24),
        usePKCE: true,
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Sign in was cancelled.');
    }

    if (result.type !== 'success') {
        throw new Error('CheFu Account sign in did not complete.');
    }

    const code = result.params.code;

    if (!code || !request.codeVerifier) {
        throw new Error('CheFu Account did not return a complete sign-in response.');
    }

    const response = await exchangeAuthorizationCode({
        code,
        codeVerifier: request.codeVerifier,
    });
    const tokens = tokenResponseToTokenSet(response);

    await saveSsoTokens(tokens);
    return tokens;
}

export async function signOutOfCheFuSso() {
    inMemoryTokens = null;
    refreshPromise = null;
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY, secureStoreOptions);
}

export async function loadSsoTokens() {
    if (inMemoryTokens !== undefined) return inMemoryTokens;

    const stored = await SecureStore.getItemAsync(
        TOKEN_STORAGE_KEY,
        secureStoreOptions,
    );
    if (!stored) {
        inMemoryTokens = null;
        return null;
    }

    try {
        inMemoryTokens = JSON.parse(stored) as CheFuSsoTokenSet;
        return inMemoryTokens;
    } catch {
        await signOutOfCheFuSso();
        return null;
    }
}

export async function getValidAccessToken() {
    const tokens = await loadSsoTokens();
    if (!tokens) return null;

    if (!isTokenExpiring(tokens)) {
        return tokens.accessToken;
    }

    const refreshed = await refreshCheFuSsoSession();
    return refreshed?.accessToken || null;
}

export async function refreshCheFuSsoSession() {
    if (refreshPromise) return refreshPromise;

    refreshPromise = refreshCheFuSsoSessionUnsafe().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

export async function fetchCheFuUserInfo(accessToken?: string) {
    const token = accessToken || (await getValidAccessToken());
    if (!token) return null;

    const response = await fetch(discovery.userInfoEndpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        const refreshed = await refreshCheFuSsoSession();
        if (!refreshed?.accessToken) return null;

        return fetchCheFuUserInfo(refreshed.accessToken);
    }

    if (!response.ok) {
        throw new Error('Unable to load CheFu Account profile.');
    }

    return (await response.json()) as CheFuSsoUserInfo;
}

export function chefuAccountManageUrl() {
    const url = new URL('/account', ACCOUNT_URL);
    url.searchParams.set('app', 'academy');
    return url.toString();
}

async function refreshCheFuSsoSessionUnsafe() {
    const tokens = await loadSsoTokens();
    if (!tokens?.refreshToken) {
        await signOutOfCheFuSso();
        return null;
    }

    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: tokens.refreshToken,
    });

    const response = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        await signOutOfCheFuSso();
        return null;
    }

    const data = (await response.json()) as CheFuSsoTokenResponse;
    const refreshed = tokenResponseToTokenSet({
        ...data,
        refresh_token: data.refresh_token || tokens.refreshToken,
    });

    await saveSsoTokens(refreshed);
    return refreshed;
}

async function exchangeAuthorizationCode({
    code,
    codeVerifier,
}: {
    code: string;
    codeVerifier: string;
}) {
    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
    });

    const response = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    const data = (await response.json().catch(() => ({}))) as
        | CheFuSsoTokenResponse
        | { error?: string; message?: string };

    if (!response.ok) {
        const message =
            'message' in data && data.message
                ? data.message
                : 'error' in data && data.error
                  ? data.error
                  : 'Unable to exchange CheFu Account sign-in code.';
        throw new Error(message);
    }

    return data as CheFuSsoTokenResponse;
}

async function saveSsoTokens(tokens: CheFuSsoTokenSet) {
    inMemoryTokens = tokens;
    await SecureStore.setItemAsync(
        TOKEN_STORAGE_KEY,
        JSON.stringify(tokens),
        secureStoreOptions,
    );
}

function tokenResponseToTokenSet(response: CheFuSsoTokenResponse) {
    const now = Math.floor(Date.now() / 1000);
    return {
        accessToken: response.access_token,
        expiresAt: response.expires_in ? now + response.expires_in : null,
        idToken: response.id_token,
        refreshToken: response.refresh_token,
        scope: response.scope,
        tokenType: response.token_type || 'Bearer',
    } satisfies CheFuSsoTokenSet;
}

function isTokenExpiring(tokens: CheFuSsoTokenSet) {
    if (!tokens.expiresAt) return false;
    return tokens.expiresAt <= Math.floor(Date.now() / 1000) + REFRESH_SKEW_SECONDS;
}

function randomOauthValue(bytes: number) {
    const alphabet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._~-';
    const values = new Uint8Array(bytes);

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(values);
    } else {
        for (let index = 0; index < values.length; index += 1) {
            values[index] = Math.floor(Math.random() * 256);
        }
    }

    return Array.from(values, value => alphabet[value % alphabet.length]).join('');
}
