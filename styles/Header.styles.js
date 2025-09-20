import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.BG,
        padding: 10,
    },
    subHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 5,
        marginTop: 20,
    },
    greeting: {
        fontFamily: "outfit-bold",
        fontSize: 24,
        color: "#fff",
        maxWidth: 200,
    },
    subText: {
        fontFamily: "space-mono",
        fontSize: 16,
        color: Colors.GREEN,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalSheet: {
        backgroundColor: Colors.BG_COLOR,
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    inputContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 20,
        paddingHorizontal: 15,
        width: "100%",
    },
    modalTitle: {
        fontFamily: "outfit-bold",
        fontSize: 20,
        color: Colors.PRIMARY,
        marginBottom: 15,
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: "#222",
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    modalIcon: {
        marginRight: 16,
    },
    modalText: {
        fontFamily: "outfit",
        fontSize: 16,
        color: Colors.PRIMARY,
    },
    search: {
        backgroundColor: Colors.BG_GRAY,
        padding: 8,
        borderRadius: 20,
        elevation: 5,
    },
    showMoreIcon: {
        padding: 5,
        backgroundColor: Colors.GRAY,
        borderRadius: 15,
    },
    text: {
        fontFamily: "outfit-bold",
        color: Colors.GREEN,
    },
});
