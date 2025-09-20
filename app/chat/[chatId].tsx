import ChatHeader from "@/component/chat/ChatHeader";
import MessageInput from "@/component/chat/MessageInput";
import MessageList from "@/component/chat/MessageList";
import UserModal from "@/component/chat/UserModal";
import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import useRelativeTime from "@/hooks/useRelativeTime";
import { sendNotification } from "@/utils/notifications";
import { showToast } from "@/utils/toast";
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
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatDetailScreen() {
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const { userDetail } = useContext(UserDetailContext);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [otherUser, setOtherUser] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();
    const db = getFirestore();

    useEffect(() => {
        if (!chatId) {
            return;
        }

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

    const lastSeen = useRelativeTime(otherUser?.lastSeen);

    const sendMessage = async () => {
        if (!userDetail || !userDetail?.email) {
            showToast("User not authenticated");
            return;
        }
        if (!newMessage.trim() || !chatId) return;

        try {
            setLoading(true);
            setNewMessage("");
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage.trim(),
                senderId: userDetail?.email,
                createdAt: serverTimestamp(),
                type: "text",
            });

            await updateDoc(doc(db, "chats", chatId), {
                lastMessage: {
                    text: newMessage.trim(),
                    sender: userDetail?.email,
                    timestamp: serverTimestamp(),
                },
                updatedAt: serverTimestamp(),
            });

            scrollViewRef.current?.scrollToEnd({ animated: true });
            await sendNotification(
                otherUser.email,
                `New message from ${userDetail.fullname}`,
                newMessage.trim()
            );
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
                <ChatHeader
                    otherUser={otherUser}
                    lastSeen={lastSeen}
                    setShowModal={setShowModal}
                />

                <MessageList
                    messages={messages}
                    userDetail={userDetail}
                    otherUser={otherUser}
                    scrollViewRef={scrollViewRef}
                />
            </KeyboardAvoidingView>

            <MessageInput
                insets={insets}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                loading={loading}
            />

            <UserModal
                showModal={showModal}
                setShowModal={setShowModal}
                otherUser={otherUser}
                lastSeen={lastSeen}
            />
        </>
    );
}