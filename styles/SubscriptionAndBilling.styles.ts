import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
    },
    icon: {
        marginTop: 30,
        backgroundColor: Colors.GRAY,
        padding: 4,
        borderRadius: 20,
        color: "white",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 30,
        color: Colors.PRIMARY,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    section: {
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "white",
    },
    planName: {
        fontSize: 16,
        marginBottom: 4,
        color: Colors.GREEN,
        fontFamily: "outfit-bold",
    },
    renewalDate: {
        fontSize: 14,
        color: "#ccc",
        marginBottom: 12,
        fontFamily: "outfit",
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#333",
    },
    paymentText: {
        color: "#ccc",
        fontSize: 14,
    },
});
