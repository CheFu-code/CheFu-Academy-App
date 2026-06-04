import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import './firebase-background-handler';

import FontErrorScreen from '@/component/FontErrorScreen';
import LoadingScreen from '@/component/LoadingScreen';
import OfflineScreen from '@/component/Offline/OfflineScreen';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import useDarkMode from '@/hooks/useDarkMode';
import useHandleDynamicLinks from '@/hooks/useHandleDynamicLinks';
import useLastSeenTracker from '@/hooks/useLastSeenTracker';
import { useNotifications } from '@/hooks/useNotifications';
import useProtectedRoute from '@/hooks/useProtectedRoute';
import { useColorScheme } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { NetworkProvider, useNetwork } from '../context/NetworkContext';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

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

function LayoutContent() {
    const { isConnected } = useNetwork();
    const { authChecked, authSuccess, retryAuth } = useBiometricAuth();
    const { backgroundColor } = useDarkMode();
    const scheme = useColorScheme();
    const [fontsLoaded, fontError] = useFonts({
        outfit: require('../assets/fonts/Outfit-Regular.ttf'),
        'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
        michroma: require('../assets/fonts/Michroma-Regular.ttf'),
        'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!isConnected) return <OfflineScreen />;
    if (fontError) return <FontErrorScreen />;

    const isUiReady = fontsLoaded;

    if (!isUiReady || !authChecked || !authSuccess) {
        return <LoadingScreen retryAuth={retryAuth} />;
    }

    return (
        <AuthProvider authGateReady={authChecked && authSuccess}>
            <AppStack
                backgroundColor={backgroundColor}
                retryAuth={retryAuth}
                scheme={scheme}
            />
        </AuthProvider>
    );
}

function AppStack({
    backgroundColor,
    retryAuth,
    scheme,
}: {
    backgroundColor: string;
    retryAuth: () => Promise<void>;
    scheme: 'dark' | 'light' | null | undefined;
}) {
    const { isLoading, userDetail } = useAuth();

    useProtectedRoute(userDetail, true);
    useLastSeenTracker(userDetail?.email);
    useNotifications(userDetail?.email);
    // useImmersiveMode();
    useHandleDynamicLinks();

    if (isLoading || userDetail === undefined) {
        return <LoadingScreen retryAuth={retryAuth} />;
    }

    return (
        <MenuProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    statusBarStyle: scheme === 'dark' ? 'dark' : 'light',
                    statusBarAnimation: 'slide',
                    gestureEnabled: true,
                    animation: 'slide_from_bottom',
                    contentStyle: {
                        backgroundColor,
                    },
                }}
            />
        </MenuProvider>
    );
}

export default Sentry.wrap(function RootLayout() {
    return (
        <NetworkProvider>
            <LayoutContent />
        </NetworkProvider>
    );
});
