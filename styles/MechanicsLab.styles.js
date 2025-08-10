import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#121212",
        flexGrow: 1,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        gap: 8,
    },
    header: {
        fontSize: 26,
        color: "#fff",
        fontFamily: "outfit-bold",
    },
    section: {
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 10,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        color: "#ffcc00",
        marginBottom: 12,
        fontFamily: "outfit-bold",
    },
    controlRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        flexShrink: 1,
    },
    buttonsRow: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        backgroundColor: "#444",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 6,
        minWidth: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    calcButton: {
        backgroundColor: "#ffcc00",
        paddingVertical: 10,
        borderRadius: 6,
        marginTop: 10,
    },
    calcButtonText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
        textAlign: "center",
    },
    resetButton: {
        backgroundColor: "#a83232",
        paddingVertical: 10,
        borderRadius: 6,
        marginTop: 8,
    },
    resetButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    resultsBox: {
        marginTop: 14,
        backgroundColor: "#333",
        padding: 12,
        borderRadius: 6,
    },
    toggleButton: {
        backgroundColor: "#555",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
});
