import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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

export default function AdminChat() {
  const { selectedUserId } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(String(selectedUserId))
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ChatMessage, 'id'>),
        }));
        setMessages(msgs);
      });

    return unsubscribe;
  }, [selectedUserId]);

  const handleSend = async () => {
    if (input.trim() === "" || !selectedUserId) return;

    await firestore()
      .collection("chats")
      .doc(String(selectedUserId))
      .collection("messages")
      .add({
        text: input,
        sender: "admin",
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    setInput("");
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 35,
            marginBottom: 40,
            marginHorizontal: 20,
          }}
        >
          <AntDesign color={"white"} name="left" size={24} />
          <Text
            style={{
              color: Colors.PRIMARY,
              fontFamily: "outfit-bold",
              fontSize: 18,
            }}
          >
            Admin Dashboard
          </Text>
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf: item.sender === "admin" ? "flex-end" : "flex-start",
                backgroundColor: item.sender === "admin" ? Colors.PRIMARY : Colors.GRAY,
                marginVertical: 4,
                padding: 10,
                borderRadius: 10,
                maxWidth: "80%",
                marginHorizontal: 10,
              }}
            >
              <Text style={{ color: "#fff" }}>{item.text}</Text>
              <Text
                style={{
                  color: Colors.BLACK,
                  fontFamily: "outfit",
                  fontSize: 10,
                  marginTop: 2,
                }}
              >
                {item.createdAt?.toDate
                  ? dayjs(item.createdAt.toDate()).format("h:mm A")
                  : ""}
              </Text>
            </View>
          )}
        />

        <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
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
              color: Colors.PRIMARY
            }}
          />
          <TouchableOpacity onPress={handleSend} style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: Colors.PRIMARY, fontWeight: "bold" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
