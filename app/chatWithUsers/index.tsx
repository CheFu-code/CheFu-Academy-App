import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface UserChat {
    id: string;
}

export default function ChatWithUsers() {
    const [userChats, setUserChats] = useState<UserChat[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chatsSnapshot = await firestore().collection("chats").get();
                const usersWithMessages = chatsSnapshot.docs.map(doc => ({ id: doc.id }));
                setUserChats(usersWithMessages);
            } catch (error) {
                console.error("❌ Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const handleUserPress = (userId: string) => {
        router.push({
            pathname: "/adminChat",
            params: { selectedUserId: userId },
        });
    };

    return (
        <View style={{ padding: 16, flex: 1, backgroundColor: Colors.BG_COLOR }}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    marginTop: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <AntDesign color={"white"} name="left" size={24} />
                <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.PRIMARY }}>
                    User Chats
                </Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
            ) : userChats.length === 0 ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: 16, fontFamily: "outfit-bold" }}>
                        No chats yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={userChats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleUserPress(item.id)}
                            style={{ padding: 12, borderBottomWidth: 1, borderColor: "#444" }}
                        >
                            <Text style={{ color: "white" }}>User ID: {item.id}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
