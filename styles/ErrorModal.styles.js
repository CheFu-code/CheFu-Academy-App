import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#121212",
        padding: 30,
        borderRadius: 16,
        alignItems: "center",
        width: 300,
    },
    title: {
        fontSize: 20,
        fontFamily: "outfit-bold",
        color: Colors.RED,
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        color: "#ccc",
        textAlign: "center",
        fontFamily: "outfit",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        gap: 10,
    },
    button: {
        flex: 1,
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        alignItems: "center",
    },
    confirmText: {
        fontWeight: "bold",
        color: Colors.WHITE,
    },
    cancelText: {
        fontFamily: "outfit-bold",
    },
});
