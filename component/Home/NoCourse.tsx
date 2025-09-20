import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import Button from "../Shared/Button";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export default function NoCourse() {
    const { safePush } = useSafeNavigation()
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
                onPress={() => safePush("/addCourse")}
                text={"+ Create new course"}
                disabled={loading}
                loading={false}
                icon={null}
                opacity={loading ? 0.5 : 1}
            />
            <Button
                onPress={() => safePush("/(tabs)/explore")}
                disabled={loading}
                text={"Explore existing courses"}
                type="outline"
                loading={false}
                icon={null}
                opacity={loading ? 0.5 : 1}
            />
        </View>
    );
}
