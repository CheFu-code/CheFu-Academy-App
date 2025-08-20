import MessageInput from "@/component/chat/MessageInput";
import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { sendMessage } from "@/utils/sendMessage";
import { AntDesign } from "@expo/vector-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../../styles/MessageList";

export default function ChatWithAI() {
    const { userDetail } = useContext(UserDetailContext);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [stopGeneration, setStopGeneration] = useState(false);
    const [currentTypingId, setCurrentTypingId] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(
        "AIzaSyDslnFAex5WgQcEmnFw1SysNBdJbkuehzY"
    );

    const sendMessageToAI = async () => {
        const messageText = newMessage || "";
        if (!messageText.trim()) return;

        await sendMessage({
            inputText: messageText,
            setMessages,
            setInputText: setNewMessage,
            setIsGenerating: setLoading,
            setStopGeneration,
            setCurrentTypingId,
            genAI,
            userDetail,
        });
    };

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: Colors.BLACK,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 30,
                            padding: 10,
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ marginRight: 12 }}
                        >
                            <AntDesign
                                name="left"
                                size={24}
                                color={Colors.WHITE}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={require("../../assets/images/logo.png")}
                                style={{
                                    width: 35,
                                    height: 35,
                                    borderRadius: 18,
                                    marginRight: 8,
                                    borderWidth: 0.6,
                                    borderColor: Colors.GRAY,
                                }}
                            />
                        </TouchableOpacity>
                        <View style={{ maxWidth: "60%" }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: Colors.WHITE,
                                        fontFamily: "outfit-bold",
                                        fontSize: 18,
                                    }}
                                >
                                    CheFu AI
                                </Text>
                                <AntDesign
                                    name="checkcircle"
                                    size={12}
                                    color={Colors.GREEN}
                                />
                            </View>
                            <Text
                                style={{
                                    color: Colors.GRAY,
                                    fontSize: 12,
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: Colors.GRAY,
                                    paddingBottom: 5,
                                }}
                            >
                                Ask me anything!
                            </Text>
                            <Text
                                style={{
                                    color: Colors.GRAY,
                                    fontSize: 10,
                                    fontFamily: "outfit",
                                    textAlign: "center",
                                }}
                            >
                                Please note we don't store your messages! When
                                you close this chat, the messages will be lost.
                            </Text>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }
            >
                {messages.length === 0 ? (
                    <Text style={styles.noMessageText}>No messages yet</Text>
                ) : (
                    messages.map((msg: any) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageRow,
                                msg.senderId === userDetail.email
                                    ? { justifyContent: "flex-end" }
                                    : { justifyContent: "flex-start" },
                            ]}
                        >
                            {msg.senderId !== userDetail.email && (
                                <Image
                                    source={require("../../assets/images/logo.png")}
                                    style={styles.avatar}
                                />
                            )}

                            <View
                                style={[
                                    styles.messageBubble,
                                    msg.senderId === userDetail.email
                                        ? styles.userMessage
                                        : styles.adminMessage,
                                ]}
                            >
                                <Text style={styles.messageText}>
                                    {msg.text}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <MessageInput
                insets={insets}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessageToAI}
                loading={loading}
            />
        </>
    );
}
