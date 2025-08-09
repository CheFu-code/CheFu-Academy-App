import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 30,
    },
    backText: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontFamily: "outfit",
        marginLeft: 5,
    },
    title: {
        fontSize: 24,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
        marginTop: 20,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        fontFamily: "outfit",
        color: Colors.GRAY,
        lineHeight: 24,
        marginBottom: 10,
    },
    footer: {
        marginTop: 30,
        fontSize: 14,
        color: Colors.GRAY,
        fontFamily: "outfit",
        textAlign: "center",
    },
});
