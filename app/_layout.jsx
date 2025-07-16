import messaging from "@react-native-firebase/messaging";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
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
        console.log("✅ Device ready for push notifications:", token);
        // TODO: Save token to backend if needed
      }
    });

    console.log("📲 Setting up foreground FCM listener");
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("🔔 Foreground notification received:", remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title ?? "Notification",
        remoteMessage.notification?.body ?? ""
      );
    });

    return () => {
      console.log("📴 Cleaning up FCM listener");
      unsubscribe();
    };
  }, []);

  // 🔗 Deep Link Listeners
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("🔗 Deep link triggered:", url);
      handleDeepLink(url);
    });

    return () => {
      console.log("🧹 Removing deep link listener");
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("🚀 App opened with initial deep link:", url);
        handleDeepLink(url);
      } else {
        console.log("ℹ️ No initial deep link found");
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

      console.log("✅ Navigating to success page:", { orderID, planType });

      router.replace({
        pathname: "/subscription/success",
        params: { token: orderID, planType },
      });
    } else if (parsed.path === "cancel") {
      console.log("⚠️ Navigating to cancel page");
      router.push("/subscription/cancel");
    } else {
      console.warn("❓ Unknown deep link path:", parsed.path);
    }
  };

  if (!fontsLoaded) {
    console.log("⏳ Fonts not loaded yet...");
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
