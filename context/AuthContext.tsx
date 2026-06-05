import { USER_DETAIL } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import {
    CheFuSsoTokenSet,
    fetchCheFuUserInfo,
    getValidAccessToken,
    loadSsoTokens,
    refreshCheFuSsoSession,
    signInWithCheFuSso,
    signOutOfCheFuSso,
} from '@/services/ssoAuth';
import { UserDetail } from '@/types/UserDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

type AuthContextValue = {
    getAccessToken: () => Promise<string | null>;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<CheFuSsoTokenSet | null>;
    reloadProfile: () => Promise<UserDetail | null>;
    setUserDetail: Dispatch<SetStateAction<UserDetail | null | undefined>>;
    tokens: CheFuSsoTokenSet | null;
    userDetail: UserDetail | null | undefined;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
    authGateReady,
    children,
}: {
    authGateReady: boolean;
    children: ReactNode;
}) {
    const [tokens, setTokens] = useState<CheFuSsoTokenSet | null>(null);
    const [userDetail, setUserDetail] = useState<UserDetail | null | undefined>(
        undefined,
    );
    const [isLoading, setIsLoading] = useState(true);

    const clearLocalSession = useCallback(
        async (options?: { revokeRemote?: boolean }) => {
            await signOutOfCheFuSso({ revokeRemote: options?.revokeRemote });
            await AsyncStorage.removeItem(USER_DETAIL);
            setTokens(null);
            setUserDetail(null);
        },
        [],
    );

    const reloadProfile = useCallback(async () => {
        const accessToken = await getValidAccessToken();
        if (!accessToken) {
            await clearLocalSession({ revokeRemote: false });
            return null;
        }

        const profile = await loadUserDetailFromSso(accessToken);
        setTokens(await loadSsoTokens());
        setUserDetail(profile);
        await AsyncStorage.setItem(USER_DETAIL, JSON.stringify(profile));
        return profile;
    }, [clearLocalSession]);

    const hydrate = useCallback(async () => {
        if (!authGateReady) return;

        setIsLoading(true);
        try {
            const storedTokens = await loadSsoTokens();
            if (!storedTokens) {
                setTokens(null);
                setUserDetail(null);
                return;
            }

            setTokens(storedTokens);
            await reloadProfile();
        } catch (error) {
            Sentry.captureException(error);
            await clearLocalSession({ revokeRemote: false });
        } finally {
            setIsLoading(false);
        }
    }, [authGateReady, clearLocalSession, reloadProfile]);

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    const login = useCallback(async () => {
        setIsLoading(true);
        try {
            const nextTokens = await signInWithCheFuSso();
            setTokens(nextTokens);
            await reloadProfile();
        } finally {
            setIsLoading(false);
        }
    }, [reloadProfile]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await clearLocalSession({ revokeRemote: true });
        } finally {
            setIsLoading(false);
        }
    }, [clearLocalSession]);

    const refresh = useCallback(async () => {
        const refreshed = await refreshCheFuSsoSession();
        setTokens(refreshed);
        if (!refreshed) setUserDetail(null);
        return refreshed;
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            getAccessToken: getValidAccessToken,
            isAuthenticated: Boolean(userDetail && tokens),
            isLoading,
            login,
            logout,
            refresh,
            reloadProfile,
            setUserDetail,
            tokens,
            userDetail,
        }),
        [isLoading, login, logout, refresh, reloadProfile, tokens, userDetail],
    );

    return (
        <AuthContext.Provider value={value}>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                {children}
            </UserDetailContext.Provider>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be used inside AuthProvider.');
    }

    return value;
}

async function loadUserDetailFromSso(accessToken: string) {
    const userInfo = await fetchCheFuUserInfo(accessToken);
    if (!userInfo?.sub) {
        throw new Error('CheFu Account did not return a user profile.');
    }

    const fallback = mapSsoUserToUserDetail(userInfo);

    try {
        const response = await chefuApiClient.get('/api/academy/mobile/me');
        const backendProfile = response.data || {};

        return {
            ...fallback,
            ...backendProfile,
            email: backendProfile.email || fallback.email,
            id: backendProfile.id || fallback.id,
            uid: backendProfile.uid || fallback.uid,
        } as UserDetail;
    } catch (error) {
        Sentry.captureException(error);
        return fallback;
    }
}

function mapSsoUserToUserDetail(
    userInfo: Awaited<ReturnType<typeof fetchCheFuUserInfo>>,
) {
    const now = new Date().toISOString() as unknown as UserDetail['createdAt'];
    return {
        id: userInfo?.sub || '',
        uid: userInfo?.sub || '',
        email: userInfo?.email || '',
        fullname: userInfo?.name || userInfo?.email?.split('@')[0] || '',
        profilePicture: '',
        bio: '',
        country: '',
        createdAt: now,
        updatedAt: now,
        fcmToken: '',
        isVerified: true,
        language: 'en',
        lastLogin: now,
        lastSeen: now,
        member: false,
        onboardingComplete: false,
        provider: 'chefu-sso',
        roles: userInfo?.roles || ['user'],
        subscriptionStatus: 'free',
        emailPreferences: {
            activity: true,
            general: true,
            marketing: false,
            security: true,
        },
        deviceInfo: {
            deviceBrand: '',
            deviceModel: '',
            deviceName: '',
            isRTL: false,
            isTablet: false,
            manufacturer: '',
            orientation: 'portrait',
            os: '',
            osVersion: 0,
            screenHeight: 0,
            screenWidth: 0,
            totalMemory: 0,
        },
    } satisfies UserDetail;
}
