// components/TermsText.tsx
import { useSafeNavigation } from "@/hooks/useSafeNavigation";
import { styles } from "@/styles/WelcomeScreen.styles";
import { Pressable, Text } from "react-native";
import { Colors } from "../constant/Colors";

export const TermsText = ({ disabled = false }: { disabled?: boolean }) => {
    const { safePush } = useSafeNavigation()
    return (
        <Pressable disabled={disabled}>
            <Text style={styles.conditions}>
                By using our app, you agree to our{" "}
                <Text
                    style={{
                        color: Colors.YELLOW,
                        textDecorationLine: "underline",
                    }}
                    onPress={() => safePush("/terms")}
                >
                    Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                    style={{
                        color: Colors.YELLOW,
                        textDecorationLine: "underline",
                    }}
                    onPress={() => safePush("/privacy")}
                >
                    Privacy Policy
                </Text>
            </Text>
        </Pressable>
    );
};
