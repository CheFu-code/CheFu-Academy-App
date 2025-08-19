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
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ChatDetailScreen() {
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const { userDetail } = useContext(UserDetailContext);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [otherUser, setOtherUser] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const db = getFirestore();

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
            const otherUserId = members.find((id) => id !== userDetail?.email);

            if (!otherUserId) return;

            const userDocRef = doc(db, "users", otherUserId);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
                setOtherUser(userSnap.data());
            }
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

    const useRelativeTime = (timestamp: any) => {
        const [timeAgo, setTimeAgo] = useState("");

        useEffect(() => {
            if (!timestamp) return;

            const updateTime = () => {
                const date =
                    timestamp?.toDate?.() || new Date(timestamp.seconds * 1000); // handle Firestore Timestamp
                const diff = Date.now() - date.getTime();

                if (diff < 60 * 1000) {
                    setTimeAgo("just now");
                } else if (diff < 60 * 60 * 1000) {
                    setTimeAgo(`${Math.floor(diff / 60000)} min ago`);
                } else if (diff < 24 * 60 * 60 * 1000) {
                    setTimeAgo(`${Math.floor(diff / 3600000)} hrs ago`);
                } else {
                    setTimeAgo(date.toLocaleDateString());
                }
            };

            updateTime();
            const interval = setInterval(updateTime, 60000); // update every minute

            return () => clearInterval(interval);
        }, [timestamp]);

        return timeAgo;
    };

    const lastSeen = useRelativeTime(otherUser?.lastSeen);

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
                lastMessage: {
                    text: newMessage.trim(),
                    sender: userDetail.email,
                    timestamp: serverTimestamp(),
                },
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
                                {otherUser
                                    ? otherUser.online
                                        ? "online"
                                        : `last seen ${lastSeen || "unknown"}`
                                    : "Loading..."}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
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
                        <Text style={styles.noMessageText}>
                            No messages yet
                        </Text>
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
                                                ? {
                                                      uri: otherUser?.profilePicture,
                                                  }
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
            </KeyboardAvoidingView>

            <View
                style={[
                    styles.inputContainer,
                    {
                        paddingBottom: insets.bottom + 5,
                    },
                ]}
            >
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

            <Modal
                presentationStyle="pageSheet" // iOS style, on Android it’s just fullscreen
                animationType="slide"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <SafeAreaView
                    style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}
                >
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Image
                            source={
                                otherUser?.profilePicture
                                    ? { uri: otherUser?.profilePicture }
                                    : require("../../assets/images/logo.png")
                            }
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                marginBottom: 15,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: "outfit-bold",
                                color: Colors.WHITE,
                            }}
                        >
                            {otherUser?.fullname || "Unknown"}
                        </Text>
                        <Text style={{ color: Colors.GRAY, marginBottom: 20 }}>
                            {otherUser
                                ? otherUser.online
                                    ? "online"
                                    : `last seen ${lastSeen || "unknown"}`
                                : "Loading..."}
                        </Text>

                        {/* Options */}
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                showToast("User blocked");
                                setShowModal(false);
                            }}
                        >
                            <Text style={styles.optionText}>Block User</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                showToast("Reported user");
                                setShowModal(false);
                            }}
                        >
                            <Text style={styles.optionText}>Report User</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                { backgroundColor: Colors.GRAY },
                            ]}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.optionText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
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
        // marginBottom: 10,
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
    optionButton: {
        width: "100%",
        padding: 15,
        borderRadius: 12,
        backgroundColor: Colors.PRIMARY,
        marginBottom: 12,
        alignItems: "center",
    },
    optionText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 16,
    },
});
