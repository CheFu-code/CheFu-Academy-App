import notifee from "@notifee/react-native";
import auth from "@react-native-firebase/auth"; // 🔺 you forgot to import this
import { getMessaging, onMessage } from "@react-native-firebase/messaging";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "../app/firebase-background-handler";
import { requestUserPermission } from "../app/notifications/requestUserPermission";
import { scheduleDailyNotification } from "../app/notifications/scheduleLocalNotification";
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

let lastHandledOrderID = null;

export default Sentry.wrap(function RootLayout() {
  const [userDetail, setUserDetail] = useState();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
    michroma: require("../assets/fonts/Michroma-Regular.ttf"),
  });

  // 🔐 Global Auth Check
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (!user) {
        console.warn("⚠️ No authenticated user. Redirecting to sign-in...");
        router.replace("/auth/signIn"); // 👈 Adjust to your actual sign-in route
      }
    });

    return unsubscribe;
  }, []);

  // 🔔 Notifications Setup
  useEffect(() => {
    requestUserPermission().then((token) => {
      if (token) {
        // Save token to backend if needed
      }
    });

    async function createChannel() {
      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        sound: "default",
        importance: 4,
      });

      await scheduleDailyNotification();
    }

    createChannel();

    const unsubscribe = onMessage(getMessaging(), async (remoteMessage) => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "Notification",
        body: remoteMessage.notification?.body || "",
        android: {
          channelId: "default",
        },
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 🔗 Deep Links
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
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
      if (orderID && orderID === lastHandledOrderID) return;
      lastHandledOrderID = orderID;

      router.replace({
        pathname: "/subscription/success",
        params: { token: orderID, planType },
      });
    } else if (parsed.path === "cancel") {
      router.push("/subscription/cancel");
    }
  };

  if (!fontsLoaded) return null;

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
            backgroundColor: "#1B263B",
          },
        }}
      />
    </UserDetailContext.Provider>
  );
});
