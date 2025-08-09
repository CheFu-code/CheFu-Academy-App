import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: 20,
        justifyContent: "center",
    },
    heading: {
        fontSize: 24,
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
        marginBottom: 30,
        textAlign: "center",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
    },
    subtext: {
        fontSize: 13,
        fontFamily: "outfit",
        color: "#aaa",
    },
    note: {
        marginTop: 30,
        fontSize: 13,
        color: "#888",
        fontFamily: "outfit",
        textAlign: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        padding: 8,
        backgroundColor: "gray",
        zIndex: 10,
        borderRadius: 20,
    },
    resetButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    resetButtonText: {
        color: "#fff",
        fontFamily: "outfit-bold",
        fontSize: 16,
    },
});
