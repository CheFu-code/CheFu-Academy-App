import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export const useRenderTextWithLinks = () => {
    const { safePush } = useSafeNavigation();

    const renderTextWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <Text
                        key={index}
                        style={{
                            color: "blue",
                            textDecorationLine: "underline",
                        }}
                        onPress={() =>
                            safePush(
                                `/InAppBrowser?url=${encodeURIComponent(
                                    part
                                )}`
                            )
                        }
                    >
                        {part}
                    </Text>
                );
            } else {
                return <Text key={index}>{part}</Text>;
            }
        });
    };

    return { renderTextWithLinks };
};
