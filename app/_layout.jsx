import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { UserDetailContext } from "../context/UserDetailContext";


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
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  // Handle real-time deep links
  useEffect(() => {
    console.log("RootLayout mounted. Waiting for deep links...");

    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link received:", url);
      handleDeepLink(url);
    });

    return () => {
      console.log("Cleaning up deep link listener");
      subscription.remove();
    };
  }, []);

  // Handle initial deep link on cold start
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("App launched with deep link:", url);
        handleDeepLink(url);
      } else {
        console.log("No initial URL found");
      }
    });
  }, []);

  const handleDeepLink = (url) => {
    const parsed = Linking.parse(url);
    if (parsed.path === "success") {
      const orderID = parsed.queryParams?.token;
      const planType = parsed.queryParams?.planType || "basic";

      if (!planType) {
        console.warn(
          "planType missing from deep link, falling back to 'basic'"
        );
      }

      if (orderID && orderID === lastHandledOrderID) {
        console.log("Ignoring duplicate deep link for orderID:", orderID);
        return;
      }
      lastHandledOrderID = orderID;

      console.log("Routing to /subscription/success with:", {
        orderID,
        planType,
      });

      router.replace({
        pathname: "/subscription/success",
        params: {
          token: orderID,
          planType,
        },
      });
    } else if (parsed.path === "cancel") {
      console.log("Routing to /subscription/cancel");
      router.push("/subscription/cancel");
    } else {
      console.warn("Unknown deep link path:", parsed.path);
    }
  };

  if (!fontsLoaded) {
    console.log("Fonts not loaded yet");
    return null;
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <Stack
        screenOptions={{
          headerShown: false, // Hide header
          statusBarStyle: "light", // "light" or "dark" for status bar text/icons color
          statusBarAnimation: "slide", // Animate status bar style changes
          gestureEnabled: true, // Enable swipe back gestures on iOS/Android
          animation: "slide_from_right", // Screen transition animation
          contentStyle: {
            // Style for the whole screen content container
            backgroundColor: "#1B263B", // Or any background color you want
          },
        }}
      />
    </UserDetailContext.Provider>
  );
});
