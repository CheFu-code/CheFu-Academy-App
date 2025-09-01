import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginVertical: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    noResources: {
        fontSize: 14,
        color: "#666",
    },
    resourceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    resourceName: {
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
    },
});
