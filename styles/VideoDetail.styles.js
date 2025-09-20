import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    video: {
        width: "100%",
        height: 300,
        backgroundColor: "#000",
        marginTop: 10,
    },
    image: {
        width: "100%",
        height: 200,
        backgroundColor: "#000",
        marginTop: 10,
    },
    enrollContainer: {
        marginBottom: 10,
        marginHorizontal: 12,
    },
    options: {
        color: Colors.BLACK,
        fontSize: 14,
        fontFamily: "outfit-bold",
    },
    tabButton: {
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    tabButtonActive: {
        backgroundColor: "white",
        borderWidth: 0.2,
        borderColor: Colors.BLACK,
    },
    section: {
        backgroundColor: Colors.BG_GRAY,
        padding: 2,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: Colors.GRAY,
        marginHorizontal: 12,
        marginTop: 25,
    },
    title: {
        fontSize: 20,
        fontFamily: "outfit-bold",
        marginVertical: 8,
        marginHorizontal: 12,
    },
    description: {
        fontSize: 16,
        fontFamily: "outfit",
        marginBottom: 20,
        marginHorizontal: 12,
    },
    enrollButton: {
        backgroundColor: Colors.GREEN,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    enrollText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backText: {
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
        fontSize: 18,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    uploadedBy: {
        fontSize: 14,
        fontFamily: "outfit",
        marginHorizontal: 12,
    },
    durationInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    duration: {
        color: Colors.BLACK,
        fontSize: 14,
        fontFamily: "outfit",
    },
    durationContainer: {
        paddingHorizontal: 6,
        marginTop: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    uploadedAt: {
        color: Colors.BLACK,
        fontSize: 14,
        fontFamily: "outfit-bold",
    },
    common: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 12,
        marginTop: 8,
        alignItems: "center",
    },
    box: {
        backgroundColor: Colors.BG_GRAY,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
        height: 100,
        width: 170,
        borderWidth: 0.6,
        borderColor: Colors.GRAY,
    },
    level: {
        fontSize: 16,
        fontFamily: "outfit",
        color: Colors.BLACK,
    },
    commonText: {
        fontSize: 16,
        fontFamily: "outfit-bold",
        color: Colors.BLACK,
    },
});
