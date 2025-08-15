// components/TermsText.tsx
import { styles } from "@/styles/WelcomeScreen.styles";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { Colors } from "../constant/Colors";

export const TermsText = ({ disabled = false }: { disabled?: boolean }) => {
    const router = useRouter();
    return (
        <Pressable disabled={disabled}>
            <Text style={styles.conditions}>
                By using our app, you agree to our{" "}
                <Text
                    style={{
                        color: Colors.YELLOW,
                        textDecorationLine: "underline",
                    }}
                    onPress={() => router.push("/terms")}
                >
                    Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                    style={{
                        color: Colors.YELLOW,
                        textDecorationLine: "underline",
                    }}
                    onPress={() => router.push("/privacy")}
                >
                    Privacy Policy
                </Text>
            </Text>
        </Pressable>
    );
};
