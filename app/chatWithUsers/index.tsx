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
}

export default function ChatWithUsers() {
    const [userChats, setUserChats] = useState<UserChat[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchChatsAndUsers = async () => {
            try {
                const chatsSnapshot = await firestore().collection("chats").get();
                const chatIds = chatsSnapshot.docs.map((doc) => doc.id);

                const userPromises = chatIds.map(async (userId) => {
                    // Fetch user data
                    const userDoc = await firestore()
                        .collection("users")
                        .doc(userId)
                        .get();
                    const fullname = userDoc
                        ? userDoc.data()?.fullname
                        : `User (${userId.substring(0, 5)}...)`;
                    const photoURL = userDoc ? userDoc.data()?.photoURL : null;

                    // Fetch last message
                    const messagesSnapshot = await firestore()
                        .collection("chats")
                        .doc(userId)
                        .collection("messages")
                        .orderBy("createdAt", "desc")
                        .limit(1)
                        .get();

                    let lastMessage = "No messages yet";
                    let lastMessageTimestamp = null;

                    if (!messagesSnapshot.empty) {
                        const lastMsgData = messagesSnapshot.docs[0].data();
                        lastMessage = lastMsgData.text;
                        lastMessageTimestamp = lastMsgData.createdAt;
                    }

                    return {
                        id: userId,
                        fullname,
                        photoURL,
                        lastMessage,
                        lastMessageTimestamp,
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
        };

        fetchChatsAndUsers();
    }, []);

    const handleUserPress = (userId: string) => {
        router.push({
            pathname: "/adminChat",
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
                        : require("../../assets/images/user.png")
                }
                style={styles.avatar}
            />
            <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                    <Text style={styles.fullname}>{item.fullname}</Text>
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
});
