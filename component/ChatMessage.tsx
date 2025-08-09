import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { styles } from "../styles/AIChat.styles";

type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
};

export default function ChatMessage({ item }: { item: Message }) {
    const isUser = item.sender === "user";
    const hasImageIcon = item.text.startsWith("[img-icon]");

    if (isUser) {
        return (
            <View style={[styles.messageContainer, styles.userMessage]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {hasImageIcon && (
                        <Ionicons
                            name="images"
                            size={20}
                            color={Colors.YELLOW}
                            style={{ marginRight: 5, backgroundColor: Colors.GRAY, padding: 10, borderRadius: 10 }}
                        />
                    )}
                    <Text style={[styles.messageText, styles.userText]}>
                        {hasImageIcon ? item.text.replace("[img-icon]", "").trim() : item.text}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.messageContainer, styles.aiMessage]}>
            <Markdown
                style={{
                    body: {
                        color: "#EDEDED",
                        fontSize: 16,
                        lineHeight: 24,
                        fontFamily: "outfit",
                    },
                    text: {
                        color: "#EDEDED",
                        fontSize: 16,
                        fontFamily: "outfit",
                    },
                    strong: {
                        fontWeight: "bold",
                        color: "#ffffff",
                    },
                    em: {
                        fontStyle: "italic",
                        color: "#cccccc",
                    },
                    heading1: {
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#ffffff",
                    },
                    heading2: {
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#dddddd",
                    },
                    heading3: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#bbbbbb",
                    },
                    link: {
                        color: "#61dafb",
                        textDecorationLine: "underline",
                    },
                    code_inline: {
                        backgroundColor: "#2a2a2a",
                        color: "#E5E5E5",
                        fontFamily: "Courier",
                        borderRadius: 4,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                    },
                    fence: {
                        backgroundColor: "#1E1E1E",
                        borderRadius: 6,
                        padding: 10,
                    },
                    code_block: {
                        backgroundColor: "#1E1E1E",
                        borderRadius: 6,
                        padding: 10,
                        color: "#E5E5E5",
                        fontFamily: "Courier",
                    },
                    blockquote: {
                        backgroundColor: "#333",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderLeftWidth: 4,
                        borderLeftColor: "#888",
                    },
                    list_item: {
                        color: "#EDEDED",
                        fontSize: 16,
                    },
                }}
            >
                {item.text}
            </Markdown>
        </View>
    );
}
