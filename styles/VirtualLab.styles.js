import { Platform, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 50 : 30;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        paddingTop: STATUS_BAR_HEIGHT,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: Colors.WHITE,
        flexShrink: 1,
        fontFamily: "outfit-bold",
        marginTop: 10,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        fontSize: 18,
        color: Colors.WHITE,
        fontFamily: "outfit",
    },
    temperatureContainer: {
        marginTop: 24,
        alignItems: "center",
    },
    temperatureText: {
        fontSize: 40,
        color: "#FF4500",
        fontFamily: "outfit-bold",
    },
    infoText: {
        fontSize: 16,
        color: Colors.GRAY,
        marginTop: 8,
    },
    statsBox: {
        marginTop: 20,
        backgroundColor: "#1f1f1f",
        padding: 12,
        borderRadius: 8,
    },
    statsText: {
        color: Colors.WHITE,
        fontSize: 16,
        marginBottom: 4,
        fontFamily: "outfit",
    },
    notesBox: {
        marginTop: 40,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
    },
    notesTitle: {
        fontSize: 18,
        color: Colors.WHITE,
        marginBottom: 8,
        fontFamily: "outfit-bold",
    },
    notesText: {
        color: Colors.GRAY,
        fontSize: 16,
        lineHeight: 22,
        fontFamily: "outfit",
    },
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepperButton: {
        backgroundColor: "#444",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    stepperText: {
        fontSize: 20,
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
    },
    resetButton: {
        backgroundColor: "#b71c1c",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    resetText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: "outfit-bold",
    },
});
