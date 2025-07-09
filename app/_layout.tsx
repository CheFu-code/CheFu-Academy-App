import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { UserDetailContext } from "./../context/UserDetailContext";
import { useState } from "react";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://edb99cb11fea0cae1b8af74d41b48fa5@o4509620168491008.ingest.de.sentry.io/4509640411381840',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const [userDetail, setUserDetail] = useState();
  useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      ></Stack>
    </UserDetailContext.Provider>
  );
});