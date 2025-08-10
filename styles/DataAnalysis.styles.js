import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#121212",
        flexGrow: 1,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 25,
        gap: 8,
    },
    header: {
        fontSize: 28,
        color: "#ffcc00",
        fontFamily: "outfit-bold",
    },
    label: {
        fontWeight: "600",
        color: "#ffcc00",
        marginVertical: 6,
    },
    inputRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        borderColor: "#555",
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: "#fff",
        fontSize: 16,
    },
    filterRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    filterInput: {
        flex: 1,
        borderColor: "#555",
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: "#fff",
        fontSize: 16,
    },
    controlsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
        justifyContent: "center",
        flexWrap: "wrap",
    },
    button: {
        backgroundColor: "#ffcc00",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 120,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
        textAlign: "center",
    },
    section: {
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffcc00",
        marginBottom: 8,
    },
    dataText: {
        color: "#fff",
        fontSize: 16,
        flexWrap: "wrap",
    },
    histogram: {
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        color: "#4caf50",
        fontSize: 14,
    },
    text: {
        color: "#fff",
        fontFamily: "outfit",
    },
});
