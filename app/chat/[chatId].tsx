import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { showToast } from "@/utils/toast";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
    addDoc,
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "@react-native-firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChatDetailScreen() {
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const { userDetail } = useContext(UserDetailContext);
    const db = getFirestore();
    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [otherUser, setOtherUser] = useState<any>(null);

    useEffect(() => {
        if (!chatId) {
            return;
        }

        // Fetch chat document
        const chatDocRef = doc(db, "chats", chatId);
        const unsubscribeChat = onSnapshot(chatDocRef, async (chatSnap) => {
            if (!chatSnap.exists()) {
                return;
            }

            const chatData = chatSnap.data();
            if (!chatData) {
                showToast("Chat does not exist");
                return;
            }

            // Assuming you have an array like ['user1@example.com', 'user2@example.com']
            const members: string[] = chatData.members || [];
            const otherUserId = members.find((id) => id !== userDetail?.uid);

            if (!otherUserId) return;

            const userDocRef = doc(db, "users", otherUserId);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
                setOtherUser(userSnap.data());
            }

            if (userSnap.exists()) setOtherUser(userSnap.data());
        });

        return () => unsubscribeChat();
    }, [chatId, userDetail]);

    // Fetch messages in real-time
    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                })
            );
            setMessages(msgs);
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });

        return () => unsubscribe();
    }, [chatId]);

    // Send a message
    const sendMessage = async () => {
        if (!userDetail || !userDetail.email) {
            showToast("User not authenticated");
            return;
        }
        if (!newMessage.trim() || !chatId) return;

        try {
            setLoading(true);
            setNewMessage("");
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage.trim(),
                senderId: userDetail.email,
                createdAt: serverTimestamp(),
                type: "text",
            });

            // Update last message in chat
            await updateDoc(doc(db, "chats", chatId), {
                lastMessage: newMessage.trim(),
                updatedAt: serverTimestamp(),
            });

            scrollViewRef.current?.scrollToEnd({ animated: true });
            setLoading(false);
        } catch (error) {
            console.log("Error sending message:", error);
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                        <AntDesign name="left" size={24} color={Colors.WHITE} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={
                                otherUser?.profilePicture
                                    ? { uri: otherUser?.profilePicture }
                                    : require("../../assets/images/logo.png")
                            }
                            style={[styles.avatar]}
                        />
                    </TouchableOpacity>
                    <View style={{ maxWidth: "60%" }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: Colors.WHITE,
                                fontFamily: "outfit-bold",
                                fontSize: 18,
                            }}
                        >
                            {otherUser?.fullname || "Chat"}
                        </Text>
                        <Text style={{ color: Colors.GRAY, fontSize: 12 }}>
                            last seen today at 12:00
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MaterialIcons
                        name="account-circle"
                        size={30}
                        color={Colors.WHITE}
                        style={{ marginRight: 10, marginTop: 30 }}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }
            >
                {messages.length === 0 ? (
                    <Text style={styles.noMessageText}>No messages yet</Text>
                ) : (
                    messages.map((msg) => (
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
                                    source={
                                        otherUser?.profilePicture
                                            ? { uri: otherUser?.profilePicture }
                                            : require("../../assets/images/logo.png")
                                    }
                                    style={styles.avatar}
                                />
                            )}

                            {/* Bubble */}
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
                                <Text style={styles.timestamp}>
                                    {new Date(
                                        msg.createdAt?.toDate?.()
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="add" size={22} color={Colors.WHITE} />
                </TouchableOpacity>
                <TextInput
                    multiline
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={Colors.GRAY}
                    style={styles.input}
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    style={[styles.sendButton, { opacity: loading ? 0.5 : 1 }]}
                    disabled={loading || !newMessage.trim()}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.WHITE} />
                    ) : (
                        <Ionicons name="send" size={22} color={Colors.WHITE} />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    noMessageText: {
        color: Colors.GRAY,
        fontFamily: "outfit-bold",
        textAlign: "center",
        marginTop: 20,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 4,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 18,
        marginRight: 8,
        borderWidth: 0.6,
        borderColor: Colors.GRAY,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 18,
        maxWidth: "70%",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    userMessage: {
        backgroundColor: Colors.PRIMARY,
        borderBottomRightRadius: 4,
    },
    adminMessage: {
        backgroundColor: Colors.GRAY,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: Colors.WHITE,
        fontFamily: "outfit",
        fontSize: 15,
    },
    timestamp: {
        color: Colors.BLACK,
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end",
        fontFamily: "outfit-bold",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.GRAY,
        alignItems: "center",
        backgroundColor: Colors.BLACK,
    },
    input: {
        flex: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        color: Colors.WHITE,
        fontFamily: "outfit",
        height: 45,
        borderWidth: 0.4,
        borderColor: Colors.GRAY,
        maxHeight: 70,
    },
    iconButton: {
        marginRight: 8,
        padding: 8,
        borderRadius: 20,
    },
    sendButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 25,
        padding: 10,
        marginLeft: 8,
        justifyContent: "center",
        alignItems: "center",
    },
});
