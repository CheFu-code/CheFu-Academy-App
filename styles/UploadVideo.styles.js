import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 10,
    },
    backButtonText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 18,
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    header: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
        fontSize: 20,
        textAlign: "center",
    },
    input: {
        backgroundColor: Colors.GRAY,
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
        color: Colors.BLACK,
        fontFamily: "outfit",
        fontSize: 16,
    },
    input2: {
        backgroundColor: Colors.GRAY,
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
        color: Colors.BLACK,
        fontFamily: "outfit",
        fontSize: 16,
        height: 100,
        textAlign: "justify",
    },
    form: {
        padding: 16,
    },
    dropdown: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        width:"60%"
    },
    dropdownContainer: {
        marginTop: 35,
        alignItems: "flex-end",
    },
    dropdownPlaceholder: {
        color: Colors.LIGHT_GRAY,
        fontSize: 14,
    },

    button: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: "600",
    },
    uploadButton: {
        backgroundColor: Colors.GREEN,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        width: 200,
    },
    uploadButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    placeholder: {
        fontFamily: "outfit",
        fontSize: 16,
    },
    topicBadge: {
        backgroundColor: Colors.GRAY,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 10,
    },
    topicText: {
        color: Colors.WHITE,
        fontSize: 14,
    },
});
