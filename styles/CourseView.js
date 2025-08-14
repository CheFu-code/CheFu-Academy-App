import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    image: {
        width: "100%",
        height: 260,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        zIndex: 1,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 2,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: 25,
        padding: 6,
    },
    downloadButton: {
        position: "absolute",
        top: 50,
        right: 20,
        zIndex: 2,
        backgroundColor: Colors.GREEN,
        borderRadius: 25,
        padding: 6,
    },
});
