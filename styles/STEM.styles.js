import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 10,
        color: Colors.WHITE,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: Colors.GRAY,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    toolsContainer: {
        marginTop: 20,
        width: "100%",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.PRIMARY,
        padding: 14,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 30,
        padding: 10,
    },
    backText: { color: Colors.WHITE, fontSize: 20, fontFamily: "outfit" },
});
