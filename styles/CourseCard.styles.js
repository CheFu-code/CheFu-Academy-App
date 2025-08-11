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
        marginRight: 5,
    },
    creatorProfilePic: {
        position: "absolute",
        top: 10, // distance from top of banner
        right: 10, // distance from left of banner
        width: 40, // size of profile pic
        height: 40,
        borderRadius: 20, // makes it round (half of width/height)
        borderWidth: 2,
        borderColor: "black", // black border to stand out on banner
        backgroundColor: "#ccc", // fallback bg color
        zIndex: 10,
    },
});
