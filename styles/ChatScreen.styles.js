import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: Colors.BG_COLOR },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    headerText: {
        fontSize: 20,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
    },
    chatItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#cccccc10",
        borderRadius: 5,
        width: "100%",
        height: 28,
    },
    chatItemText: {
        fontSize: 16,
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
        paddingLeft: 10,
    },
    noChatContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    noChatText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 16,
    },
});
