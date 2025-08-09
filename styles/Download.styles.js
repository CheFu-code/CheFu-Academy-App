import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.BG_COLOR,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        color: Colors.WHITE,
    },
    empty: {
        textAlign: "center",
        color: "gray",
    },
    desc: {
        marginTop: 7,
        fontFamily: "outfit",
        borderBottomWidth: 2,
        borderBottomColor: Colors.PRIMARY,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderRightColor: Colors.YELLOW,
        padding: 10,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        fontSize: 16,
    },
    itemBox: {
        backgroundColor: Colors.BG_GRAY,
        padding: 15,
        marginTop: 10,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 16,
        fontFamily: "outfit-bold",
        maxWidth: "80%",
    },
    delete: {
        color: "red",
        fontFamily: "outfit-bold",
        textAlign: "center",
        backgroundColor: "gray",
        marginTop: 8,
        marginBottom: 8,
        padding: 8,
        borderRadius: 10,
    },
    backButton: {
        position: "absolute",
        top: 50, // adjust as needed for safe area
        left: 20,
        zIndex: 2,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: 25,
        padding: 6,
    },
});
