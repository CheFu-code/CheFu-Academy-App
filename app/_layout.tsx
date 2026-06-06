import '../global.css';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import './firebase-background-handler';

import FontErrorScreen from '@/component/FontErrorScreen';
import LoadingScreen from '@/component/LoadingScreen';
import OfflineScreen from '@/component/Offline/OfflineScreen';
import { Colors } from '@/constant/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import useDarkMode from '@/hooks/useDarkMode';
import useHandleDynamicLinks from '@/hooks/useHandleDynamicLinks';
import useLastSeenTracker from '@/hooks/useLastSeenTracker';
import { useNotifications } from '@/hooks/useNotifications';
import useProtectedRoute from '@/hooks/useProtectedRoute';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { NetworkProvider, useNetwork } from '../context/NetworkContext';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,
    enabled: Boolean(SENTRY_DSN),
    sendDefaultPii: false,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
    ],
});

export function ErrorBoundary({
    error,
    retry,
}: {
    error: Error;
    retry: () => void;
}) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <SafeAreaView
            style={[
                errorStyles.container,
                { backgroundColor: isDark ? Colors.BG_COLOR : Colors.WHITE },
            ]}
        >
            <Text
                accessibilityRole="header"
                style={[
                    errorStyles.title,
                    { color: isDark ? Colors.WHITE : Colors.BG_COLOR },
                ]}
            >
                Something went wrong
            </Text>
            <Text
                style={[
                    errorStyles.message,
                    { color: isDark ? '#d1d5db' : '#4b5563' },
                ]}
            >
                The app hit an unexpected error. Retry will reload this screen.
            </Text>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retry loading this screen"
                hitSlop={8}
                onPress={retry}
                style={({ pressed }) => [
                    errorStyles.button,
                    pressed && errorStyles.buttonPressed,
                ]}
            >
                <Text style={errorStyles.buttonText}>Retry</Text>
            </Pressable>
        </SafeAreaView>
    );
}

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

const errorStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        lineHeight: 22,
        marginTop: 10,
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        marginTop: 22,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: Colors.PRIMARY,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 15,
        fontWeight: '700',
    },
});
