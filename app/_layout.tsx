import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "./firebase-background-handler";

import FontErrorScreen from "@/component/FontErrorScreen";
import LoadingScreen from "@/component/LoadingScreen";
import { useDeepLinking } from "@/hooks/useDeepLinking";
import { useFirebaseAuthObserver } from "@/hooks/useFirebaseAuthObserver";
import useLastSeenTracker from "@/hooks/useLastSeenTracker";
import { useNotifications } from "@/hooks/useNotifications";
import { UserDetail } from "@/types/UserDetail";
import OfflineScreen from "../component/OfflineScreen";
import { Colors } from "../constant/Colors";
import { NetworkProvider, useNetwork } from "../context/NetworkContext";
import { UserDetailContext } from "../context/UserDetailContext";
import { useBiometricAuth } from "../hooks/useBiometricAuth";

// ✅ Sentry Init
Sentry.init({
    dsn: "https://edb99cb11fea0cae1b8af74d41b48fa5@o4509620168491008.ingest.de.sentry.io/4509640411381840",
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
    authChecked: boolean
) => {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Wait until the auth state is actually checked before redirecting.
        if (!authChecked) {
            return;
        }

        const inAuthGroup = segments[0] === "auth";

        if (userDetail && inAuthGroup) {
            // User is signed in and on an auth screen, redirect to home.
            router.replace("/(tabs)/home");
        } else if (!userDetail && !inAuthGroup) {
            // User is not signed in and not on a protected screen, redirect to sign in.
            router.replace("/auth/signIn");
        }
    }, [userDetail, segments, authChecked, router]);
};

function LayoutContent() {
    const { isConnected } = useNetwork();

    const [fontsLoaded, fontError] = useFonts({
        outfit: require("../assets/fonts/Outfit-Regular.ttf"),
        "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
        michroma: require("../assets/fonts/Michroma-Regular.ttf"),
        "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    const { authChecked, authSuccess } = useBiometricAuth();
    const { userDetail, setUserDetail } = useFirebaseAuthObserver(
        authChecked,
        authSuccess
    );

    useProtectedRoute(userDetail, authChecked);
    useLastSeenTracker();
    useNotifications();
    useDeepLinking();

    if (!isConnected) return <OfflineScreen />;

    if (fontError) return <FontErrorScreen />;

    if (!fontsLoaded || !authChecked || !authSuccess) return <LoadingScreen />;

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    statusBarStyle: "light",
                    statusBarAnimation: "slide",
                    gestureEnabled: true,
                    animation: "slide_from_right",
                    contentStyle: {
                        backgroundColor: Colors.BG_COLOR,
                    },
                }}
            />
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