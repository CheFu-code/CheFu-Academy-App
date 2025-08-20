import notifee from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import * as LocalAuthentication from "expo-local-authentication";
import { Stack, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import "./firebase-background-handler";
import { requestUserPermission } from "./notifications/requestUserPermission";
import { scheduleDailyNotification } from "./notifications/scheduleLocalNotification";

import useLastSeenTracker from "@/hooks/useLastSeenTracker";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { getMessaging, onMessage } from "@react-native-firebase/messaging";
import OfflineScreen from "../component/OfflineScreen";
import { Colors } from "../constant/Colors";
import { NetworkProvider, useNetwork } from "../context/NetworkContext";
import { UserDetailContext } from "../context/UserDetailContext";

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

function LayoutContent() {
    const [userDetail, setUserDetail] = useState();
    const [authChecked, setAuthChecked] = useState(false);
    const [authSuccess, setAuthSuccess] = useState(false);
    const { isConnected } = useNetwork();
    const router = useRouter();
    const lastHandledOrderID = useRef(null);
    const alreadyRedirected = useRef(false);

    const [fontsLoaded, fontError] = useFonts({
        outfit: require("../assets/fonts/Outfit-Regular.ttf"),
        "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
        michroma: require("../assets/fonts/Michroma-Regular.ttf"),
        "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        const checkBiometrics = async () => {
            try {
                const biometricEnabled = await AsyncStorage.getItem(
                    "useBiometrics"
                );
                if (biometricEnabled === "true") {
                    const hasHardware =
                        await LocalAuthentication.hasHardwareAsync();
                    const isEnrolled =
                        await LocalAuthentication.isEnrolledAsync();

                    if (!hasHardware || !isEnrolled) {
                        Alert.alert(
                            "Biometric unavailable",
                            "Your device does not support biometric authentication."
                        );
                        setAuthSuccess(true);
                        return;
                    }

                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: "Unlock CheFu Academy",
                        fallbackLabel: "Use device PIN",
                        cancelLabel: "Cancel",
                    });

                    setAuthSuccess(result.success);
                } else {
                    setAuthSuccess(true);
                }
            } catch (error:) {
                console.error("Biometric error:", error);
                Sentry.captureException("Biometric error:", error);
                setAuthSuccess(true);
            } finally {
                setAuthChecked(true);
            }
        };

        checkBiometrics();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(getApp()), (user) => {
            if (
                authChecked &&
                authSuccess &&
                !user &&
                !alreadyRedirected.current
            ) {
                alreadyRedirected.current = true;
                console.warn(
                    "No authenticated user from layout. Redirecting to welcome screen"
                );
                router.replace("/");
            }
        });
        return unsubscribe;
    }, [authChecked, authSuccess, router]);

    useLastSeenTracker(); // 👈 call it here

    useEffect(() => {
        requestUserPermission();

        async function createNotificationSetup() {
            await notifee.createChannel({
                id: "default",
                name: "Default Channel",
                sound: "default",
                importance: 4,
            });

            const alreadyScheduled = await AsyncStorage.getItem(
                "dailyNotificationScheduled"
            );

            if (!alreadyScheduled) {
                await scheduleDailyNotification();
                await AsyncStorage.setItem(
                    "dailyNotificationScheduled",
                    "true"
                );
            }
        }

        createNotificationSetup();

        const unsubscribe = onMessage(
            getMessaging(getApp()),
            async (remoteMessage) => {
                await notifee.displayNotification({
                    title: remoteMessage.notification?.title || "Notification",
                    body: remoteMessage.notification?.body || "",
                    android: { channelId: "default" },
                });
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const subscription = Linking.addEventListener("url", ({ url }) => {
            handleDeepLink(url);
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });
    }, []);

    const handleDeepLink = (url) => {
        const parsed = Linking.parse(url);
        const orderID = parsed.queryParams?.token;
        const planType = parsed.queryParams?.planType || "basic";

        if (parsed.path === "success") {
            if (orderID && orderID === lastHandledOrderID.current) return;
            lastHandledOrderID.current = orderID;

            router.replace({
                pathname: "/subscription/success",
                params: { token: orderID, planType },
            });
        } else if (parsed.path === "cancel") {
            router.push("/subscription/cancel");
        }
    };

    if (!isConnected) return <OfflineScreen />;

    if (fontError) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#1B263B",
                    paddingHorizontal: 24,
                }}
            >
                <Text
                    style={{
                        color: "#E57373",
                        fontSize: 16,
                        fontFamily: "System",
                        textAlign: "center",
                    }}
                >
                    Failed to load fonts. Please restart the app.
                </Text>
            </View>
        );
    }

    if (!fontsLoaded || !authChecked || !authSuccess) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.BG_COLOR,
                    paddingHorizontal: 18,
                }}
            >
                <LottieView
                    source={require("../assets/animations/Face scanning.json")}
                    autoPlay
                    loop
                    style={{ width: 150, height: 150 }}
                />
                <Text
                    style={{
                        marginTop: 20,
                        fontSize: 16,
                        color: Colors.GREEN,
                        fontFamily: "outfit-bold",
                        textAlign: "center",
                    }}
                >
                    Please wait while we unlock CheFu Academy for you...
                </Text>
                <Text
                    style={{
                        marginTop: 8,
                        fontSize: 14,
                        color: Colors.WHITE,
                        fontFamily: "outfit-bold",
                        textAlign: "center",
                    }}
                >
                    We help you learn with confidence and privacy.
                </Text>
            </View>
        );
    }

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
