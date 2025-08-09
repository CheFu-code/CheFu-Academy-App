import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        marginTop: 10,
        width: "49%",
    },
    bannerImage: {
        width: "100%",
        height: 100,
        borderRadius: 10,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 8,
        color: Colors.PRIMARY,
    },
    chapterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 18,
    },
    chapter: {
        fontSize: 14,
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
    },
    time: {
        fontSize: 10,
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
    },
});
