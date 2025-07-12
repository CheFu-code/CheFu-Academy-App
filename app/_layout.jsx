import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { UserDetailContext } from "../context/UserDetailContext";

Sentry.init({
  dsn: 'https://edb99cb11fea0cae1b8af74d41b48fa5@o4509620168491008.ingest.de.sentry.io/4509640411381840',
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

export default Sentry.wrap(function RootLayout() {
  const [userDetail, setUserDetail] = useState();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    console.log("RootLayout mounted. Waiting for deep links...");

    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link received:", url);
      const parsed = Linking.parse(url);
      console.log("Parsed deep link:", parsed);

      if (parsed.path === "paypal-success") {
        console.log("Routing to /subscription/success");
        router.push("/subscription/success");
      } else if (parsed.path === "paypal-cancel") {
        console.log("Routing to /subscription/cancel");
        router.push("/subscription/cancel");
      } else {
        console.warn("Unknown deep link path:", parsed.path);
      }
    });

    // Log initial URL if app was opened from a cold start via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("App launched with deep link:", url);
        const parsed = Linking.parse(url);
        if (parsed.path === "paypal-success") {
          console.log("Initial URL matched paypal-success");
          router.push("/subscription/success");
        } else if (parsed.path === "paypal-cancel") {
          console.log("Initial URL matched paypal-cancel");
          router.push("/subscription/cancel");
        } else {
          console.warn("Initial deep link path unknown:", parsed.path);
        }
      } else {
        console.log("No initial URL found");
      }
    });

    return () => {
      console.log("Cleaning up deep link listener");
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    console.log("Fonts not loaded yet");
    return null;
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </UserDetailContext.Provider>
  );
});
