import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 12,
        padding: 12,
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
        marginRight: 5,
    },
    creatorProfilePicWrapper: {
        position: "absolute",
        top: 10, // distance from top of banner
        right: 10, // distance from left of banner
        zIndex: 10,
    },
    creatorProfilePic: {
        width: 48,
        height: 48,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "#ccc",
        borderRadius: 24,
    },
});
