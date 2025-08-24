import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    },
    backButtonText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontFamily: "outfit-bold",
    },
    emptyBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: Colors.GRAY,
        fontSize: 16,
        fontFamily: "outfit",
    },
    courseCard: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
        width: "49%",
        marginRight: "1%",
    },
    courseTitle: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontFamily: "outfit-bold",
    },
    courseCategory: {
        fontSize: 14,
        color: Colors.GRAY,
    },
    bannerImage: {
        width: "100%",
        height: 100,
        borderRadius: 10,
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
    loader: { justifyContent: "center", alignItems: "center", flex: 1 },
    detailsContainer: {
        flex: 1,
        justifyContent: "space-between",
        minHeight: 80,
    },
    completedBadge: {
        fontSize: 12,
        color: Colors.GREEN,
        fontFamily: "outfit-bold",
    },
    checkmark: {
        position: "absolute",
        top: 10, // distance from top of banner
        right: 12, // distance from left of banner
        zIndex: 10,
    },
});
