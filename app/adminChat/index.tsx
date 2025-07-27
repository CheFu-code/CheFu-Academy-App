import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { AntDesign } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    createdAt: any;
}

// Assuming a fixed admin email for notifications. In a real app, this might be fetched dynamically.
const ADMIN_EMAIL = "kurisanim2@gmail.com"; // REPLACE WITH ACTUAL ADMIN EMAIL

async function sendNotification(userEmail: string, title: string, body: string) {
    try {
        const response = await fetch("https://chefu-academy-tmzx.onrender.com/api/sendToUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail, title, body }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Failed to send notification:", errorText);
        } else {
            console.log("✅ Notification sent successfully!");
        }
    } catch (error) {
        console.error("❌ Error sending notification:", error);
    }
}

export default function AdminChat() {
    const { userDetail } = useContext(UserDetailContext)
    const { selectedUserId } = useLocalSearchParams();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const flatListRef = useRef<FlatList>(null);
    const [sending, setSending] = useState(false);
    const [selectedUserFullname, setSelectedUserFullname] = useState<
        string | null
    >(null);
    const isAdmin = userDetail?.roles?.includes("admin");

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    useEffect(() => {
        if (!selectedUserId) return;

        const fetchUserFullname = async () => {
            try {
                const userDoc = await firestore()
                    .collection("users")
                    .doc(String(selectedUserId))
                    .get();
                if (userDoc.exists()) {
                    setSelectedUserFullname(
                        userDoc.data()?.fullname ||
                        `User (${String(selectedUserId).substring(0, 5)}...)`
                    );
                } else {
                    setSelectedUserFullname(
                        `User (${String(selectedUserId).substring(0, 5)}...)`
                    );
                }
            } catch (error) {
                console.error("Error fetching user fullname:", error);
                setSelectedUserFullname(
                    `User (${String(selectedUserId).substring(0, 5)}...)`
                );
            }
        };

        fetchUserFullname();

        const unsubscribe = firestore()
            .collection("chats")
            .doc(String(selectedUserId))
            .collection("messages")
            .orderBy("createdAt", "asc")
            .onSnapshot((snapshot) => {
                const msgs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<ChatMessage, "id">),
                }));
                setMessages(msgs);
            });

        return unsubscribe;
    }, [selectedUserId]);

    const handleSend = async () => {
        if (input.trim() === "" || !selectedUserId) return;
        setSending(true);

        await firestore()
            .collection("chats")
            .doc(String(selectedUserId))
            .collection("messages")
            .add({
                text: input,
                sender: "admin",
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
        setSending(false);
        // Send notification to user 
        if (isAdmin) {
            await sendNotification(
                ADMIN_EMAIL,
                "You've got a reply from CheFu Academy Support",
                input.trim()
            );
        }
        setInput("");

        flatListRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 100}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 35,
                        marginBottom: 10,
                        marginHorizontal: 20,
                    }}
                >
                    <AntDesign color={"white"} name="left" size={24} />
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 5,
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.GREEN,
                                fontFamily: "outfit-bold",
                                fontSize: 20,
                            }}
                        >
                            {selectedUserFullname}
                        </Text>
                    </View>
                </TouchableOpacity>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                alignSelf: item.sender === "admin" ? "flex-end" : "flex-start",
                                backgroundColor:
                                    item.sender === "admin" ? Colors.PRIMARY : Colors.BG,
                                marginVertical: 4,
                                padding: 10,
                                borderRadius: 10,
                                maxWidth: "80%",
                                marginHorizontal: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: item.sender === "admin" ? Colors.BLACK : Colors.RED,
                                    fontFamily: "outfit-bold",
                                    fontSize: 16,
                                    marginBottom: 5,
                                    textAlign: item.sender === "admin" ? "right" : "left",
                                }}
                            >
                                {item.sender === "admin" ? "Admin" : selectedUserFullname}
                            </Text>
                            <Text style={{ color: "#fff", fontFamily: "outfit-bold" }}>
                                {item.text}
                            </Text>
                            <Text
                                style={{
                                    color: item.sender === "admin" ? Colors.BLACK : Colors.GREEN,
                                    fontFamily: "outfit-bold",
                                    fontSize: 10,
                                    marginTop: 2,
                                    textAlign: item.sender === "admin" ? "right" : "left",
                                }}
                            >
                                {item.createdAt?.toDate
                                    ? dayjs(item.createdAt.toDate()).format("h:mm A")
                                    : ""}
                            </Text>
                        </View>
                    )}
                />

                <View
                    style={{
                        flexDirection: "row",
                        padding: 10,
                        alignItems: "center",
                        marginBottom: 50,
                    }}
                >
                    <TextInput
                        numberOfLines={4}
                        multiline={true}
                        placeholderTextColor={Colors.WHITE}
                        placeholder="Type a message..."
                        value={input}
                        onChangeText={setInput}
                        style={{
                            flex: 1,
                            borderColor: "#ccc",
                            borderWidth: 1,
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            marginRight: 10,
                            color: Colors.PRIMARY,
                            marginTop: 10,
                        }}
                    />
                    <TouchableOpacity
                        disabled={sending || !selectedUserId || input.trim() === ""}
                        onPress={handleSend}
                        style={{
                            paddingHorizontal: 16,
                            backgroundColor: Colors.WHITE,
                            paddingVertical: 10,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            opacity:
                                sending || !selectedUserId || input.trim() === "" ? 0.5 : 1,
                        }}
                    >
                        {sending ? (
                            <ActivityIndicator size={"small"} color={"white"} />
                        ) : (
                            <Text
                                style={{ color: Colors.PRIMARY, fontFamily: "outfit-bold" }}
                            >
                                Send
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
