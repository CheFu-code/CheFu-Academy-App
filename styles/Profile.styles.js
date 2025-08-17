import { Platform, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    header: {
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 40 : 20,
        paddingBottom: 20,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 2,
        marginBottom: 15,
        marginTop: 15,
        objectFit: "contain",
    },
    profileName: {
        fontSize: 22,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
        maxWidth: 250,
        marginBottom: 5,
    },
    profileEmail: {
        fontSize: 15,
        fontFamily: "outfit",
        color: Colors.GRAY,
        maxWidth: 250,
    },
    planStatus: {
        fontSize: 15,
        fontFamily: "outfit",
        marginTop: 5,
    },
    menuSection: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 10,
        backgroundColor: "#222",
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    icon: {
        marginRight: 16,
    },
    menuLabel: {
        fontSize: 17,
        fontFamily: "outfit",
        color: Colors.PRIMARY,
    },
    divider: {
        height: 1,
        backgroundColor: "#444",
        marginVertical: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: Colors.BG_COLOR,
        width: "85%",
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
        marginBottom: 15,
    },
    input: {
        backgroundColor: "#333",
        padding: 12,
        borderRadius: 8,
        color: "#fff",
        fontFamily: "outfit",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontFamily: "outfit-bold",
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 10,
    },

    inputWithIcon: {
        flex: 1,
        color: "#fff",
        fontFamily: "outfit",
        fontSize: 16,
        paddingRight: 10, // spacing before the icon
    },
    expiryText: {
        fontFamily: "outfit",
        fontSize: 15,
        marginTop: 5,
        color: "#ccc",
    },
    versionText: {
        textAlign: "center",
        color: Colors.GRAY,
        marginTop: 10,
        marginBottom: 20,
        fontFamily: "outfit",
    },
    forgotPasswordText: {
        fontFamily: "outfit",
        fontSize: 14,
        color: Colors.GRAY,
        marginBottom: 20,
        textAlign: "right",
        textDecorationLine: "underline",
        fontStyle:"italic"
    },
});
