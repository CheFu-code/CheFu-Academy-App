import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontFamily: "outfit-bold",
        fontSize: 22,
        color: "white",
    },
    icon: {
        backgroundColor: "gray",
        padding: 5,
        borderRadius: 20,
    },
    dropdown: {
        position: "absolute",
        right: 20,
        top: 95,
        backgroundColor: "#333",
        borderRadius: 8,
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        width: 130,
        paddingLeft: 8,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
        textAlign: "center",
    },
    optionText: {
        color: "#fff",
        fontFamily: "outfit-bold",
    },
    heading: {
        fontSize: 18,
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
        marginTop: 20,
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        fontFamily: "outfit",
        color: Colors.WHITE,
    },
    codeBlock: {
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    codeLabel: {
        color: Colors.PRIMARY,
        fontFamily: "outfit-bold",
        fontSize: 14,
        marginBottom: 4,
    },
    codeText: {
        color: "#d4d4d4",
        fontFamily: "outfit",
        fontSize: 13,
        letterSpacing: 1.8,
    },
});
