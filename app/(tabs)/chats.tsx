import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { styles } from "@/styles/Profile.styles";
import { User } from "@/types/user";
import { showToast } from "@/utils/toast";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getDocs,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Chat {
    id: string;
    name?: string;
    lastMessage?: string;
    members?: string[];
    profilePicture?: string;
}

const ChatScreen = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [chats, setChats] = useState<Chat[]>([]);
    const [userList, setUserList] = useState<any[]>([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const router = useRouter();
    const db = getFirestore();
    const [otherUsersMap, setOtherUsersMap] = useState<{ [id: string]: any }>(
        {}
    );

    useEffect(() => {
        const fetchOtherUsers = async () => {
            const usersMap: { [id: string]: any } = {};
            for (const chat of chats) {
                const otherUserId = chat.members?.find(
                    (id) => id !== userDetail.uid
                );
                if (!otherUserId) continue;
                const docSnap = await getDoc(doc(db, "users", otherUserId));
                if (docSnap.exists()) {
                    usersMap[otherUserId] = docSnap.data();
                }
            }
            setOtherUsersMap(usersMap);
        };
        fetchOtherUsers();
    }, [chats]);

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "users"));
            const users: User[] = snapshot.docs
                .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((u: User) => u.id !== userDetail.uid);
            setUserList(users);
            setShowUserModal(true);
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    const startChat = async (targetName: string, targetId: string) => {
        try {
            // Check if chat with this member already exists
            const existingChat = chats.find(
                (c) =>
                    c.members?.includes(targetId) &&
                    c.members?.includes(userDetail.uid)
            );

            let chatId = existingChat?.id;

            if (!chatId) {
                const chatRef = await addDoc(collection(db, "chats"), {
                    name: targetName,
                    members: [userDetail.uid, targetId],
                    lastMessage: "",
                    updatedAt: serverTimestamp(),
                });

                chatId = chatRef.id;
            }

            if (!chatId) {
                showToast("Chat not found");
                return;
            }

            router.push({
                pathname: "/chat/[chatId]",
                params: { chatId },
            });
        } catch (error) {
            console.log("Error starting chat:", error);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        try {
            Alert.alert(
                "Delete Chat",
                "Are you sure you want to delete this chat?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            const messagesSnapshot = await getDocs(
                                collection(db, "chats", chatId, "messages")
                            );

                            const deletePromises = messagesSnapshot.docs.map(
                                (
                                    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot
                                ) => deleteDoc(doc.ref)
                            );
                            await Promise.all(deletePromises);

                            // Delete the chat itself
                            await deleteDoc(doc(db, "chats", chatId));

                            showToast("Chat deleted successfully");
                        },
                    },
                ]
            );
        } catch (error) {
            showToast("Error deleting chat");
            console.log("Error deleting chat:", error);
        }
    };

    useEffect(() => {
        const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatData = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                })
            ) as Chat[];
            setChats(chatData);
        });
        return () => unsubscribe();
    }, []);

    const SectionHeader = ({ title }: { title: string }) => (
        <Text
            style={{
                fontSize: 16,
                fontFamily: "outfit-bold",
                color: Colors.WHITE,
                marginBottom: 10,
            }}
        >
            {title}
        </Text>
    );

    const ChatItem = ({
        imageSource,
        name,
        subtitle,
        onPress,
        onLongPress,
        showCheck,
    }: {
        imageSource: any;
        name: string;
        subtitle: string;
        onPress: () => void;
        onLongPress?: () => void;
        showCheck?: boolean;
    }) => (
        <TouchableOpacity onLongPress={onLongPress} onPress={onPress}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                    marginLeft: 5,
                    marginTop: 5,
                }}
            >
                <View
                    style={{
                        width: 50,
                        height: 50,
                        backgroundColor: Colors.WHITE,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={imageSource}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                color: "white",
                                fontFamily: "outfit-bold",
                                fontSize: 15,
                            }}
                        >
                            {name}
                        </Text>
                        {showCheck && (
                            <AntDesign
                                name="checkcircleo"
                                size={13}
                                color={Colors.PRIMARY}
                                style={{ marginLeft: 5 }}
                            />
                        )}
                    </View>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            color: Colors.GRAY,
                            fontFamily: "outfit",
                            fontSize: 14,
                        }}
                    >
                        {subtitle}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { padding: 20 }]}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 20,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontFamily: "outfit-bold",
                        color: Colors.PRIMARY,
                    }}
                >
                    Chat
                </Text>
                <TouchableOpacity onPress={() => router.push("/settings")}>
                    <Ionicons
                        name="settings-outline"
                        size={20}
                        color={Colors.GRAY}
                    />
                </TouchableOpacity>
            </View>

            <SectionHeader title="AI Tutor" />
            <ChatItem
                imageSource={require("../../assets/images/logo.png")}
                name="CheFu AI"
                subtitle="Ask me anything"
                onPress={() => router.push("/ai/chefu-ai")}
                showCheck={true}
            />

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <SectionHeader title="Chats" />
                <TouchableOpacity onPress={fetchUsers}>
                    <AntDesign name="plus" size={24} color={Colors.GRAY} />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flexGrow: 0, marginBottom: 30 }}
            >
                {chats.length === 0 ? (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "outfit-bold",
                                fontSize: 16,
                            }}
                        >
                            No chats yet
                        </Text>
                    </View>
                ) : (
                    chats.map((chat) => {
                        const otherUserId = chat.members?.find(
                            (id) => id !== userDetail.uid
                        );
                        if (!otherUserId) return null;
                        const otherUserData = otherUsersMap[otherUserId];

                        return (
                            <ChatItem
                                key={chat.id}
                                imageSource={
                                    otherUserData?.profilePicture
                                        ? { uri: otherUserData.profilePicture }
                                        : require("../../assets/images/logo.png")
                                }
                                name={otherUserData?.fullname || "Unknown User"}
                                subtitle={chat.lastMessage || "No messages yet"}
                                onPress={() =>
                                    router.push({
                                        pathname: "/chat/[chatId]",
                                        params: { chatId: chat.id },
                                    })
                                }
                                onLongPress={() => handleDeleteChat(chat.id)}
                                showCheck={
                                    otherUserData
                                        ? otherUserData.member === true ||
                                          otherUserData.roles?.includes("admin")
                                        : false
                                }
                            />
                        );
                    })
                )}
            </ScrollView>

            <Modal visible={showUserModal} animationType="slide" transparent>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(52, 48, 48, 0.75)",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: Colors.BLACK,
                            borderRadius: 12,
                            margin: 20,
                            padding: 10,
                            maxHeight: "70%",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "outfit-bold",
                                fontSize: 18,
                                color: Colors.WHITE,
                                marginBottom: 15,
                                textAlign: "center",
                            }}
                        >
                            Start a conversation
                        </Text>
                        <View>
                            <TextInput
                                placeholder="Search for a friend..."
                                placeholderTextColor={Colors.GRAY}
                                style={{
                                    backgroundColor: Colors.BG_COLOR,
                                    borderRadius: 8,
                                    padding: 12,
                                    marginBottom: 12,
                                    color: Colors.WHITE,
                                }}
                            />
                            <AntDesign
                                name="search1"
                                size={24}
                                color={Colors.WHITE}
                                style={{
                                    position: "absolute",
                                    right: 12,
                                    top: 10,
                                }}
                            />
                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={userList.filter(
                                (item) => item.id !== userDetail.email
                            )}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowUserModal(false);
                                        startChat(
                                            item.fullname || "User",
                                            item.id
                                        );
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 8,
                                    }}
                                >
                                    <Image
                                        source={
                                            item.profilePicture
                                                ? { uri: item.profilePicture }
                                                : require("../../assets/images/logo.png")
                                        }
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            marginRight: 10,
                                            borderWidth: 0.2,
                                            borderColor: "green",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: Colors.WHITE,
                                            fontFamily: "outfit",
                                        }}
                                    >
                                        {item.fullname || "Unnamed User"}
                                    </Text>
                                    {(item.member === true ||
                                        item.roles?.includes("admin")) && (
                                        <AntDesign
                                            name="checkcircleo"
                                            size={13}
                                            color={Colors.PRIMARY}
                                            style={{ marginLeft: 5 }}
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            onPress={() => setShowUserModal(false)}
                            style={{
                                marginTop: 15,
                                alignSelf: "center",
                                padding: 10,
                                borderRadius: 6,
                                backgroundColor: Colors.PRIMARY,
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.WHITE,
                                    fontFamily: "outfit-bold",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ChatScreen;
