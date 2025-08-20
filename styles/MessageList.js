import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    noMessageText: {
        color: Colors.GRAY,
        fontFamily: "outfit-bold",
        textAlign: "center",
        marginTop: 20,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 4,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 18,
        marginRight: 8,
        borderWidth: 0.6,
        borderColor: Colors.GRAY,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 18,
        maxWidth: "70%",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    userMessage: {
        backgroundColor: Colors.PRIMARY,
        borderBottomRightRadius: 4,
    },
    adminMessage: {
        backgroundColor: Colors.GRAY,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: Colors.WHITE,
        fontFamily: "outfit",
        fontSize: 15,
    },
    timestamp: {
        color: Colors.BLACK,
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end",
        fontFamily: "outfit-bold",
    },
});
