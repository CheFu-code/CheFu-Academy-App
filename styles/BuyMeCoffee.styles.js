import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        color: Colors.BG_COLOR,
    },
    heading: {
        fontSize: 23,
        fontWeight: "bold",
        marginBottom: 15,
        color: Colors.PRIMARY,
        marginTop: 25,
        textAlign: "center",
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff",
        marginBottom: 15,
    },
    quote: {
        fontStyle: "italic",
        fontSize: 16,
        color: "#666",
        marginVertical: 20,
        paddingLeft: 10,
        borderLeftWidth: 3,
        borderLeftColor: "#ccc",
    },
    buttonContainer: {
        borderRadius: 20,
        backgroundColor: Colors.YELLOW,
        padding: 10,
        maxWidth: 200,
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 80,
    },
    buttonText: {
        textAlign: "center",
        padding: 5,
        fontFamily: "outfit-bold",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 20,
    },
    buyMeCoffee: {
        color: Colors.YELLOW,
        fontFamily: "space-mono",
        fontSize: 20,
    },
});
