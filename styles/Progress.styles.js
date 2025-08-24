import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
    },
    loadingText: {
        marginTop: 10,
        fontFamily: "outfit-bold",
        fontSize: 16,
        color: Colors.PRIMARY,
    },
    headerText: {
        fontFamily: "outfit-bold",
        fontSize: 24,
        color: Colors.PRIMARY,
        letterSpacing: 1,
        padding: 10,
    },
});
