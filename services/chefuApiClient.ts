import axios, {
    AxiosError,
    AxiosHeaders,
    InternalAxiosRequestConfig,
} from 'axios';
import {
    getValidAccessToken,
    refreshCheFuSsoSession,
    signOutOfCheFuSso,
} from '@/services/ssoAuth';

const API_URL =
    process.env.EXPO_PUBLIC_CHEFU_API_URL ||
    process.env.EXPO_PUBLIC_CHEFU_OAUTH_ISSUER ||
    'https://api.chefuinc.com';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export const chefuApiClient = axios.create({
    baseURL: API_URL.replace(/\/$/, ''),
    timeout: 30_000,
});

chefuApiClient.interceptors.request.use(async (config) => {
    const accessToken = await getValidAccessToken();
    if (!accessToken) return config;

    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);
    config.headers = headers;
    return config;
});

chefuApiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const config = error.config as RetryableRequestConfig | undefined;

        if (error.response?.status !== 401 || !config || config._retry) {
            return Promise.reject(error);
        }

        config._retry = true;
        const refreshed = await refreshCheFuSsoSession();

        if (!refreshed?.accessToken) {
            await signOutOfCheFuSso();
            return Promise.reject(error);
        }

        const headers = AxiosHeaders.from(config.headers);
        headers.set('Authorization', `Bearer ${refreshed.accessToken}`);
        config.headers = headers;

        return chefuApiClient(config);
    },
);

export async function chefuFetch(
    input: string,
    init: RequestInit = {},
    retry = true,
) {
    const accessToken = await getValidAccessToken();
    const headers = new Headers(init.headers);

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(`${API_URL.replace(/\/$/, '')}${input}`, {
        ...init,
        headers,
    });

    if (response.status !== 401 || !retry) {
        return response;
    }

    const refreshed = await refreshCheFuSsoSession();
    if (!refreshed?.accessToken) {
        await signOutOfCheFuSso();
        return response;
    }

    return chefuFetch(input, init, false);
}
