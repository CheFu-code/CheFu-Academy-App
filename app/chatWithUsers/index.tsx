import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import firestore, {
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

dayjs.extend(relativeTime);

interface UserChat {
    id: string;
    fullname: string;
    lastMessage: string;
    lastMessageTimestamp: FirebaseFirestoreTypes.Timestamp | null;
    photoURL: string | null;
    unreadCount: number;
}

export default function ChatWithUsers() {
    const [userChats, setUserChats] = useState<UserChat[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = firestore().collection("chats").onSnapshot(async (chatsSnapshot) => {
            try {
                const chatIds = chatsSnapshot.docs.map((doc) => doc.id);

                const userPromises = chatIds.map(async (userId) => {
                    // Fetch user data
                    const userDoc = await firestore()
                        .collection("users")
                        .doc(userId)
                        .get();
                    const fullname = userDoc.exists()
                        ? userDoc.data()?.fullname
                        : `User (${userId.substring(0, 5)}...)`;
                    const photoURL = userDoc.exists() ? userDoc.data()?.photoURL : null;

                    // Fetch last message and unread count
                    const chatDoc = chatsSnapshot.docs.find(doc => doc.id === userId);
                    const lastReadByAdmin = chatDoc?.data()?.lastReadByAdmin || null;

                    const messagesRef = firestore()
                        .collection("chats")
                        .doc(userId)
                        .collection("messages");

                    const lastMessageQuery = messagesRef
                        .orderBy("createdAt", "desc")
                        .limit(1);
                    const messagesSnapshot = await lastMessageQuery.get();

                    let lastMessage = "No messages yet";
                    let lastMessageTimestamp = null;

                    if (!messagesSnapshot.empty) {
                        const lastMsgData = messagesSnapshot.docs[0].data();
                        lastMessage = lastMsgData.text;
                        lastMessageTimestamp = lastMsgData.createdAt;
                    }

                    let unreadCount = 0;
                    if (lastReadByAdmin) {
                        const unreadQuery = messagesRef
                            .where("sender", "!=", "admin")
                            .where("createdAt", ">", lastReadByAdmin);
                        const unreadSnapshot = await unreadQuery.get();
                        unreadCount = unreadSnapshot.size;
                    } else {
                        // If no lastReadByAdmin, all user messages are unread
                        const allUserMessagesQuery = messagesRef.where("sender", "!=", "admin");
                        const allUserMessagesSnapshot = await allUserMessagesQuery.get();
                        unreadCount = allUserMessagesSnapshot.size;
                    }

                    return {
                        id: userId,
                        fullname,
                        photoURL,
                        lastMessage,
                        lastMessageTimestamp,
                        unreadCount,
                    };
                });

                const usersData = await Promise.all(userPromises);

                // Sort chats by the most recent message
                usersData.sort((a, b) => {
                    if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
                        return (
                            b.lastMessageTimestamp.toMillis() -
                            a.lastMessageTimestamp.toMillis()
                        );
                    }
                    return 0;
                });

                setUserChats(usersData);
            } catch (error) {
                console.error("❌ Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUserPress = async (userId: string) => {
        // Mark messages as read for this chat
        await firestore().collection("chats").doc(userId).set(
            { lastReadByAdmin: firestore.FieldValue.serverTimestamp() },
            { merge: true }
        );

        router.push({
            pathname: "/adminChat" as any,
            params: { selectedUserId: userId },
        });
    };

    const renderChatItem = ({ item }: { item: UserChat }) => (
        <TouchableOpacity
            onPress={() => handleUserPress(item.id)}
            style={styles.chatItem}
        >
            <Image
                source={
                    item.photoURL
                        ? { uri: item.photoURL }
                        : require("../../assets/images/logo.png")
                }
                style={styles.avatar}
            />
            <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                    <View style={styles.nameAndBadgeContainer}>
                        <Text style={styles.fullname}>{item.fullname}</Text>
                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.timestamp}>
                        {item.lastMessageTimestamp
                            ? dayjs(item.lastMessageTimestamp.toDate()).fromNow(true)
                            : ""}
                    </Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.header}>
                <AntDesign color={"white"} name="left" size={24} />
                <Text style={styles.headerText}>User Chats</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator
                    size={"large"}
                    color={Colors.PRIMARY}
                    style={{ flex: 1 }}
                />
            ) : userChats.length === 0 ? (
                <View style={styles.noChatsContainer}>
                    <Text style={styles.noChatsText}>No active chats yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={userChats}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChatItem}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    header: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.PRIMARY,
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noChatsText: {
        color: "white",
        fontSize: 16,
        fontFamily: "outfit-bold",
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#2a2a2a",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: "#333",
    },
    chatContent: {
        flex: 1,
        justifyContent: "center",
    },
    chatHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    nameAndBadgeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    fullname: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    timestamp: {
        color: "#999",
        fontSize: 12,
    },
    lastMessage: {
        color: "#bbb",
        fontSize: 14,
    },
    unreadBadge: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
    unreadBadgeText: {
        color: Colors.WHITE,
        fontSize: 12,
        fontWeight: "bold",
    },
});
