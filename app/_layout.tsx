import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';
import './firebase-background-handler';

import FontErrorScreen from '@/component/FontErrorScreen';
import LoadingScreen from '@/component/LoadingScreen';
import { useDeepLinking } from '@/hooks/useDeepLinking';
import { useFirebaseAuthObserver } from '@/hooks/useFirebaseAuthObserver';
import useLastSeenTracker from '@/hooks/useLastSeenTracker';
import { useNotifications } from '@/hooks/useNotifications';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { UserDetail } from '@/types/UserDetail';
import { MenuProvider } from 'react-native-popup-menu';
import OfflineScreen from '../component/OfflineScreen';
import { Colors } from '../constant/Colors';
import { NetworkProvider, useNetwork } from '../context/NetworkContext';
import { UserDetailContext } from '../context/UserDetailContext';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import useHandleDynamicLinks from '@/hooks/useHandleDynamicLinks';
import { useImmersiveMode } from '@/hooks/useImmersiveMode';

// ✅ Sentry Init
Sentry.init({
    dsn: 'https://edb99cb11fea0cae1b8af74d41b48fa5@o4509620168491008.ingest.de.sentry.io/4509640411381840',
    sendDefaultPii: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
    ],
});

const useProtectedRoute = (
    userDetail: UserDetail | null | undefined,
    authChecked: boolean,
) => {
    const segments = useSegments();
    const { safeReplace } = useSafeNavigation();

    useEffect(() => {
        if (!authChecked) return;
        if (userDetail === undefined) return; // still resolving auth

        const first = segments?.[0];
        const inAuthGroup = first === 'auth';

        // Avoid repeated replaces when already in the right place
        if (userDetail && inAuthGroup) {
            safeReplace('/(tabs)/home');
            return;
        }
        if (!userDetail && !inAuthGroup) {
            safeReplace('/auth/signIn');
        }
    }, [authChecked, userDetail, segments, safeReplace]);
};

function LayoutContent() {
    const { isConnected } = useNetwork();

    const [fontsLoaded, fontError] = useFonts({
        outfit: require('../assets/fonts/Outfit-Regular.ttf'),
        'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
        michroma: require('../assets/fonts/Michroma-Regular.ttf'),
        'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const { authChecked, authSuccess, retryAuth } = useBiometricAuth();
    const { userDetail, setUserDetail } = useFirebaseAuthObserver(
        authChecked,
        authSuccess,
    );

    useProtectedRoute(userDetail, authChecked);
    useLastSeenTracker();
    useNotifications();
    useImmersiveMode();
    useDeepLinking();
    useHandleDynamicLinks();

    
    if (!isConnected) return <OfflineScreen />;
    if (fontError) return <FontErrorScreen />;

    const isUiReady = fontsLoaded;
    const isAuthReady = authChecked && authSuccess && userDetail !== undefined;

    if (!isUiReady || !isAuthReady) {
        return <LoadingScreen retryAuth={retryAuth} />;
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <MenuProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        statusBarStyle: 'light',
                        statusBarAnimation: 'slide',
                        gestureEnabled: true,
                        animation: 'slide_from_right',
                        contentStyle: {
                            backgroundColor: Colors.BG_COLOR,
                        },
                    }}
                />
            </MenuProvider>
        </UserDetailContext.Provider>
    );
}

export default Sentry.wrap(function RootLayout() {
    return (
        <NetworkProvider>
            <LayoutContent />
        </NetworkProvider>
    );
});
