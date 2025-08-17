import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    codeExampleText: {
        backgroundColor: Colors.GREEN,
        padding: 15,
        borderRadius: 10,
        fontFamily: "outfit",
        fontSize: 14,
        color: Colors.WHITE,
        marginTop: 10,
    },
    codeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },

    codeLabel: {
        color: "#8BE9FD",
        fontFamily: "outfit-bold",
        fontSize: 13,
        paddingLeft: 15,
        paddingTop: 10,
    },

    copyButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 10,
        backgroundColor: "#23272F",
        borderRadius: 6,
        marginTop: 10,
    },
    copyButtonText: {
        color: "green",
        fontFamily: "outfit-bold",
        fontSize: 13,
    },
    codeBlockTopBar: {
        height: 30,
        backgroundColor: "#282c34",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        gap: 10,
    },

    windowCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 1,
    },
    circleRed: { backgroundColor: "#ff5f56" },
    circleYellow: { backgroundColor: "#ffbd2e" },
    circleGreen: { backgroundColor: "#27c93f" },

    codeBlockContainer: {
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#1e1e2f", // dark bluish-gray like VS Code
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
        width: "100%",
        maxWidth: "100%",
    },
    advancedCodeBlock: {
        fontFamily: "monospace",
        fontSize: 15,
        color: "#abb2bf", // soft light gray
        padding: 15,
        lineHeight: 22,
        minWidth: 200,
        backgroundColor: "transparent",
    },
    container: {
        padding: 25,
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
    },
    backButtonContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    topic: {
        fontFamily: "outfit-bold",
        fontSize: 20,
        color: Colors.PRIMARY,
        marginBottom: 10,
    },
    explainContainer: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    content: {
        fontFamily: "monospace",
        fontSize: 16,
        color: Colors.YELLOW,
        backgroundColor: "#333",
        borderRadius: 5,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    exampleText: {
        fontFamily: "outfit",
        fontSize: 16,
        color: Colors.WHITE,
        marginTop: 20,
    },
});
