import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import Button from "../Shared/Button";

export default function NoCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ marginTop: 60, display: "flex", alignItems: "center" }}>
      <Image
        style={{
          height: 200,
          width: 180,
        }}
        source={require("../../assets/images/book1.webp")}
      />
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
          textAlign: "center",
          color: "#fff",
        }}
      >
        You don't have any course yet
      </Text>

      <Button
        onPress={() => router.push("/addCourse")}
        text={"+ Create new course"}
        disabled={loading}
      />
      <Button
        onPress={() => router.push("/(tabs)/explore")}
        disabled={loading}
        text={"Explore existing courses"}
        type="outline"
      />
    </View>
  );
}
