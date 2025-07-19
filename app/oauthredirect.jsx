import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Colors } from "../constant/Colors";

export default function OAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectToHome = async () => {
      // You can log or handle any logic here before navigating
      router.replace("/(tabs)/home");
    };

    redirectToHome();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
      }}
    >
      <ActivityIndicator
        style={{
          marginBottom: 20,
          backgroundColor: Colors.BG_COLOR,
        }}
        color={Colors.GREEN}
        size="large"
      />
      <Text
        style={{
          fontSize: 24,
          color: Colors.GREEN,
          fontFamily: "outfit-bold",
          marginBottom: 10,
        }}
      >
        Welcome to CheFu Academy!
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: Colors.WHITE,
          fontFamily: "outfit",
          textAlign: "center",
          paddingHorizontal: 20,
        }}
      >
        Preparing your CheFu Academy learning space...
      </Text>
    </View>
  );
}
