import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { AntDesign } from "@expo/vector-icons";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    createdAt: FirebaseFirestoreTypes.Timestamp;
}

export default function ChatWithAdmin() {
    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const { width } = Dimensions.get("window");
    const scrollRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const isAdmin = userDetail?.roles?.includes("admin");
    const { selectedUserId } = useLocalSearchParams();
    const chatId = isAdmin ? String(selectedUserId) : userDetail?.email;

    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [chatMessages]);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = firestore()
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .orderBy("createdAt", "asc")
            .onSnapshot((snapshot) => {
                const messages = snapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            text: data.text,
                            sender: data.sender,
                            createdAt: data.createdAt,
                        } as ChatMessage;
                    })
                    .filter((msg): msg is ChatMessage => !!msg.text && !!msg.sender && !!msg.createdAt);

                setChatMessages(messages);
                setLoading(false);
            });

        return () => unsubscribe();
    }, [chatId]);

    const handleSend = async () => {
        if (!message.trim() || !chatId) return;
        setSending(true);

        try {
            const chatDocRef = firestore().collection("chats").doc(chatId);

            await firestore().runTransaction(async (transaction) => {
                transaction.set(chatDocRef, {
                    lastUpdated: firestore.FieldValue.serverTimestamp(),
                    participants: isAdmin ? [chatId, "admin"] : [chatId],
                }, { merge: true });

                const messagesRef = chatDocRef.collection("messages");
                transaction.set(messagesRef.doc(), {
                    text: message.trim(),
                    sender: isAdmin ? "admin" : "user",
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
            });

            setMessage("");
        } catch (error) {
            console.error("❌ Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 35,
                    marginBottom: 40,
                    marginHorizontal: 20,
                }}
            >
                <AntDesign color={"white"} name="left" size={24} />
                <Text
                    style={{
                        color: Colors.PRIMARY,
                        fontFamily: "outfit-bold",
                        fontSize: 18,
                    }}
                >
                    Live Support
                </Text>
            </TouchableOpacity>

            <View>
                <Text
                    style={{
                        color: "gray",
                        fontFamily: "outfit",
                        fontSize: 15,
                        textAlign: "center",
                        marginBottom: 20,
                    }}
                >
                    Welcome {userDetail?.fullname?.split(" ")[0] || "there"}, how can we
                    help you today?
                </Text>
            </View>

            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 10,
                    paddingBottom: 100,
                    backgroundColor: Colors.BG,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                }}
            >
                {loading ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        <LottieView
                            style={{
                                width: width * 0.5,
                                height: width * 0.5,
                                marginBottom: 20,
                            }}
                            autoPlay
                            loop
                            source={require("../../assets/animations/Loading.json")}
                        />

                        <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
                            Loading messages...
                        </Text>
                    </View>
                ) : null}

                {chatMessages.length === 0 && !loading && (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: 20,
                                color: Colors.WHITE,
                                fontFamily: "outfit-bold",
                                fontSize: 16,
                            }}
                        >
                            No messages yet, start the conversation!
                        </Text>
                    </View>
                )}

                {chatMessages.map((msg) => (
                    <View
                        key={msg.id}
                        style={{
                            alignSelf: msg.sender === "admin" ? "flex-start" : "flex-end",
                            backgroundColor:
                                msg.sender === "admin" ? Colors.PRIMARY : Colors.GREEN,
                            marginTop: 20,
                            padding: 10,
                            borderRadius: 10,
                            maxWidth: "80%",
                            marginBottom: 28
                        }}
                    >
                        <Text style={{ color: "white", fontFamily: "outfit-bold", marginBottom: 2 }}>
                            {msg.text}
                        </Text>
                        <Text
                            style={{
                                color: msg.sender === "admin" ? Colors.BLACK : Colors.WHITE,
                                fontFamily: "outfit-bold",
                                fontSize: 10,
                                marginTop: 2,
                                borderTopWidth: 0.2,
                                borderColor: "#333",
                                paddingTop: 5,
                                textAlign: msg.sender === "admin" ? "right" : "left",
                            }}
                        >
                            {msg.createdAt?.toDate
                                ? dayjs(msg.createdAt.toDate()).format("h:mm A")
                                : ""}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderColor: "#333",
                    backgroundColor: Colors.BG_COLOR,
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                }}
            >
                <TextInput
                    placeholder="Type your message..."
                    numberOfLines={4}
                    multiline={true}
                    placeholderTextColor={"gray"}
                    style={{
                        flex: 1,
                        color: "white",
                        fontFamily: "outfit",
                        fontSize: 16,
                        backgroundColor: "#1a1a1a",
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        borderRadius: 30,
                        marginBottom: 50,

                    }}
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity
                    disabled={sending || !message.trim()}
                    onPress={handleSend}
                    style={{
                        marginLeft: 10,
                        padding: 10,
                        borderRadius: 50,
                        backgroundColor: message.trim()
                            ? Colors.LIGHT_GREEN
                            : Colors.LIGHT_RED,
                        marginBottom: 50,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {sending ? (
                        <ActivityIndicator size={"small"} color={Colors.PRIMARY} />
                    ) : (
                        <AntDesign
                            style={{ opacity: message.trim() ? 1 : 0.5 }}
                            name="arrowup"
                            size={24}
                            color={message.trim() ? Colors.GREEN : Colors.PRIMARY}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}