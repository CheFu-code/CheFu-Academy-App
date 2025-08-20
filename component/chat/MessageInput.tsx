import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MessageInput({
    insets,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
}: any) {
    return (
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
                style={[styles.sendButton, { opacity: loading || !newMessage.trim() ? 0.5 : 1 }]}
                disabled={loading || !newMessage.trim()}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.WHITE} />
                ) : (
                    <Ionicons name="send" size={22} color={Colors.WHITE} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.GRAY,
        alignItems: "center",
        backgroundColor: Colors.BLACK,
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
});
