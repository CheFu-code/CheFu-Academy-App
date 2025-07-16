import { getMessaging, onMessage } from "@react-native-firebase/messaging";

import notifee from '@notifee/react-native';
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "../app/firebase-background-handler";
import { requestUserPermission } from "../app/notifications/requestUserPermission"; // ✅ this path is fine
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

  // 🔔 FCM Setup
  useEffect(() => {
    requestUserPermission().then((token) => {
      if (token) {
        // Save token to backend if needed
      }
    });

    // Create Android channel on mount (required for Android)
    async function createChannel() {
      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
      });
    }
    createChannel();

    const unsubscribe = onMessage(getMessaging(), async (remoteMessage) => {
      // Show a system notification instead of alert
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

  // 🔗 Deep Link Listeners
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
      if (url) {
        handleDeepLink(url);
      }
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
    } else {
    }
  };

  if (!fontsLoaded) {
    return null;
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
            backgroundColor: "#1B263B",
          },
        }}
      />
    </UserDetailContext.Provider>
  );
});
