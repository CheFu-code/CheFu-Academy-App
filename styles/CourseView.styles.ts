import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    chapterText: {
        fontFamily: "outfit",
        fontSize: 16,
    },
    buttonContainer: {
        marginVertical: 8,
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "solid",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chapterTextContent: {
        fontFamily: "outfit-bold",
        fontSize: 20,
        color: Colors.WHITE,
    },
    chapterNameContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
    },
});
