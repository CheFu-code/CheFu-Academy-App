import { SectionHeader } from "@/component/SectionHeader";
import { ChatItem } from "@/component/chat/ChatItem";
import { StartChatModal } from "@/component/chatScreen/StartChatModal";
import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useChats } from "@/hooks/useChats";
import { useUsers } from "@/hooks/useUsers";
import { styles } from "@/styles/ChatScreen.styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const ChatScreen = () => {
    const { userDetail } = useContext(UserDetailContext);
    const { chats, otherUsersMap, startChat, deleteChat } = useChats();
    const { userList, fetchUsers } = useUsers();
    const [showUserModal, setShowUserModal] = useState(false);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Chat</Text>
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

            <View style={styles.chatItemContainer}>
                <Text style={styles.chatItemText}>Chats</Text>
                <TouchableOpacity
                    onPress={() => {
                        fetchUsers();
                        setShowUserModal(true);
                    }}
                >
                    <AntDesign
                        style={{ marginRight: 10 }}
                        name="plus"
                        size={24}
                        color={Colors.GRAY}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flexGrow: 0, marginBottom: 30 }}
            >
                {chats.length === 0 ? (
                    <View style={styles.noChatContainer}>
                        <Text style={styles.noChatText}>No chats yet</Text>
                    </View>
                ) : (
                    chats.map((chat) => {
                        const otherUserId = chat.members?.find(
                            (id) => id !== userDetail.email
                        );
                        const otherUserData = otherUsersMap[otherUserId || ""];

                        return (
                            <ChatItem
                                key={chat.id}
                                imageSource={
                                    otherUserData?.profilePicture
                                        ? { uri: otherUserData.profilePicture }
                                        : require("../../assets/images/logo.png")
                                }
                                name={otherUserData?.fullname || "Unknown User"}
                                subtitle={
                                    chat.lastMessage
                                        ? chat.lastMessage.sender ===
                                          userList[0]?.id
                                            ? `You: ${chat.lastMessage.text}`
                                            : chat.lastMessage.text
                                        : "No messages yet"
                                }
                                onPress={() =>
                                    router.push({
                                        pathname: "/chat/[chatId]",
                                        params: { chatId: chat.id },
                                    })
                                }
                                onLongPress={() => deleteChat(chat.id)}
                                showCheck={
                                    otherUserData?.member === true ||
                                    otherUserData?.roles?.includes("admin")
                                }
                            />
                        );
                    })
                )}
            </ScrollView>

            <StartChatModal
                visible={showUserModal}
                onClose={() => setShowUserModal(false)}
                users={userList}
                onStartChat={({ id, fullname }) => {
                    setShowUserModal(false);
                    startChat(fullname || "User", id);
                }}
            />
        </View>
    );
};

export default ChatScreen;