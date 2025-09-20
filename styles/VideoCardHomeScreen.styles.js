import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";


export const styles = StyleSheet.create({
    cardWrapper: {
        position: "relative",
        marginVertical: 10,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 10,
    },
    card: {
        overflow: "hidden",
        alignItems: "center",
        width: "100%",
    },
    thumbnail: {
        height: 200,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        backgroundColor: Colors.GRAY,
        width: "100%",
    },
    title: {
        color: "#000",
        marginTop: 5,
        fontSize: 16,
        fontFamily: "outfit-bold",
        paddingHorizontal: 6,
    },
    description: {
        color: Colors.BLACK,
        marginBottom: 5,
        fontSize: 16,
        fontFamily: "outfit",
        paddingHorizontal: 6,
    },
    categoryText: {
        color: "#fff",
        fontFamily: "outfit-bold",
    },
    category: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
        backgroundColor: Colors.GREEN,
        padding: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.BLACK,
    },
    durationContainer: {
        paddingHorizontal: 6,
        marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    duration: {
        color: Colors.BLACK,
        fontSize: 14,
        fontFamily: "outfit",
    },
    uploadedAt: {
        color: Colors.BLACK,
        fontSize: 14,
        fontFamily: "outfit-bold",
    },
    durationInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    categoryRow:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
});
