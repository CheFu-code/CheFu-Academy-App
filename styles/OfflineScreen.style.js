import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        color: Colors.RED,
        fontSize: 24,
        fontFamily: "outfit-bold",
        marginBottom: 8,
    },
    subtitle: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        fontFamily: "outfit",
    },
    lottie: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },
});
