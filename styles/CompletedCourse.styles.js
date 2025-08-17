import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.PRIMARY,
    },
    courseItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.BG_GRAY,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    courseTitle: {
        fontSize: 18,
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
    },
    courseDate: {
        fontSize: 14,
        color: Colors.GREEN,
        marginTop: 2,
        fontFamily: "outfit-bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        marginTop: 12,
        fontSize: 18,
        color: Colors.GRAY,
        fontFamily: "outfit-bold",
    },
    button: {
        marginTop: 25,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
    },
    indicatorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
        padding: 20,
    },
});
