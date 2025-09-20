import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    textInput: {
        width: "100%",
        borderWidth: 1,
        padding: 15,
        fontSize: 18,
        marginTop: 20,
        borderRadius: 8,
        color: "#ffffff",
        borderColor: "#858585",
    },
    passwordInput: {
        flex: 1,
        fontSize: 18,
        paddingVertical: 15,
        color: "#ffffff",
    },
    passwordContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderColor: "#858585",
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#121212",
        padding: 30,
        borderRadius: 16,
        alignItems: "center",
        width: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: "outfit-bold",
        color: Colors.GREEN,
        marginTop: 15,
    },
    modalSubtext: {
        fontSize: 14,
        color: "#ccc",
        textAlign: "center",
        marginTop: 8,
    },
    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: Colors.BG,
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    icons: {
        textAlign: "center",
        marginVertical: 10,
    },
    signInButonContaner: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        width: "100%",
        borderRadius: 10,
        marginTop: 25,
    },
    signInButton: {
        fontFamily: "outfit",
        fontSize: 20,
        textAlign: "center",
        color: Colors.WHITE,
    },
    welcomeText: {
        fontSize: 28,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
    },
    lottieView: {
        width: 180,
        height: 180,
        marginBottom: 15,
        resizeMode: "contain",
    },
});
