import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#121212",
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#f5f5f5",
        marginBottom: 15,
        textAlign: "center",
    },
    searchInput: {
        backgroundColor: "#222",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: "#eee",
        fontSize: 16,
        marginBottom: 10,
    },
    bookmarkCounter: {
        color: "#f5a623",
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#a0a0a0",
        marginTop: 10,
        marginBottom: 10,
    },
    noResults: {
        fontStyle: "italic",
        color: "#777",
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    cardDesc: {
        fontSize: 16,
        color: "#ddd",
        marginTop: 6,
    },
    bookmarkBtn: {
        padding: 4,
    },
    bookmarked: {
        color: "#f5a623",
    },
    noteLabel: {
        marginTop: 10,
        color: "#bbb",
        fontWeight: "600",
    },
    noteInput: {
        backgroundColor: "#333",
        color: "#eee",
        minHeight: 60,
        borderRadius: 6,
        padding: 8,
        marginTop: 6,
        fontSize: 14,
        textAlignVertical: "top",
    },
    faqCard: {
        backgroundColor: "#222",
        borderRadius: 10,
        marginBottom: 12,
        padding: 12,
    },
    faqHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    faqQuestion: {
        fontSize: 17,
        color: "#f0a500",
        fontWeight: "600",
        flex: 1,
    },
    faqAnswer: {
        marginTop: 8,
        fontSize: 15,
        color: "#ccc",
    },
    copyBtn: {
        marginTop: 10,
        backgroundColor: "#f0a500",
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
    },
    copyBtnText: {
        color: "#222",
        fontWeight: "bold",
    },
    bookmarkText: {
        color: "#aaa", // default star color
    },
    bookmarkedText: {
        color: "#FFD700", // gold color for bookmarked star
    },
});
