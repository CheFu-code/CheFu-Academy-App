import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    headerText: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.PRIMARY,
    },
    listContainer: {
        padding: 16,
    },
    courseCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 0.3,
        borderColor: Colors.BLACK,
    },
    courseInfo: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.PRIMARY,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: Colors.GRAY,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    remove: {
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.LIGHT_RED,
        marginLeft: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});
