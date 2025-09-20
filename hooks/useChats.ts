// hooks/useChats.ts
import { UserDetailContext } from "@/context/UserDetailContext";
import { showToast } from "@/utils/toast";
import { addDoc, collection, deleteDoc, doc, FirebaseFirestoreTypes, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, where } from "@react-native-firebase/firestore";
import { useContext, useEffect, useState } from "react";

export interface Chat {
    id: string;
    name?: string;
    lastMessage?: {
        text: string;
        sender: string;
    };
    members?: string[];
    profilePicture?: string;
}

export const useChats = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [chats, setChats] = useState<Chat[]>([]);
    const [otherUsersMap, setOtherUsersMap] = useState<{ [id: string]: any }>({});
    const db = getFirestore();

    useEffect(() => {
        if (!userDetail?.email) return;
        const q = query(
            collection(db, "chats"),
            where("members", "array-contains", userDetail?.email),
            orderBy("updatedAt", "desc")
        );
        const unsubscribe = onSnapshot(q, snapshot => {
            const chatData = snapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() })) as Chat[];
            setChats(chatData);
        });
        return () => unsubscribe();
    }, [userDetail?.email]);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            const usersMap: { [id: string]: any } = {};
            for (const chat of chats) {
                const otherUserId = chat.members?.find(id => id !== userDetail?.email);
                if (!otherUserId) continue;
                const docSnap = await getDoc(doc(db, "users", otherUserId));
                if (docSnap.exists()) usersMap[otherUserId] = docSnap.data();
            }
            setOtherUsersMap(usersMap);
        };
        fetchOtherUsers();
    }, [chats]);

    const startChat = async (targetName: string, targetId: string) => {
        try {
            let chatId = chats.find(c => c.members?.includes(targetId) && c.members?.includes(userDetail?.email))?.id;
            if (!chatId) {
                const chatRef = await addDoc(collection(db, "chats"), {
                    name: targetName,
                    members: [userDetail?.email, targetId],
                    lastMessage: { text: "", sender: "", timestamp: serverTimestamp() },
                    updatedAt: serverTimestamp(),
                });
                chatId = chatRef.id;

                const docSnap = await getDoc(doc(db, "users", targetId));
                if (docSnap.exists()) setOtherUsersMap(prev => ({ ...prev, [targetId]: docSnap.data() }));
            }
            return chatId;
        } catch (error) {
            console.log("Error starting chat:", error);
            showToast("Error starting chat");
            return null;
        }
    };

    const deleteChat = async (chatId: string) => {
        try {
            const messagesSnapshot = await getDocs(collection(db, "chats", chatId, "messages"));
            await Promise.all(messagesSnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => deleteDoc(doc.ref)));
            await deleteDoc(doc(db, "chats", chatId));
            showToast("Chat deleted successfully");
        } catch (error) {
            console.log("Error deleting chat:", error);
            showToast("Error deleting chat");
        }
    };

    return { chats, otherUsersMap, startChat, deleteChat };
};
