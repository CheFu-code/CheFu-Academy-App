import { Colors } from "@/constant/Colors";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
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
            </View>
          )}
        />

        <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
          <TextInput
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
              color:Colors.PRIMARY
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
