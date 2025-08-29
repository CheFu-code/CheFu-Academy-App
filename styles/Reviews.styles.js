import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        marginBottom: 8,
        fontFamily: "outfit-bold",
    },
    deleteButton: {
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },
    reviewHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    date: {
        fontSize: 14,
        color: Colors.BLACK,
        fontFamily: "outfit",
    },
    noReviewsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    noReviewsText: {
        fontFamily: "outfit-bold",
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 8,
        padding: 10,
        width: "100%",
        marginBottom: 12,
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
    },
    addRating: {
        backgroundColor: Colors.BG_GRAY,
        padding: 5,
        borderRadius: 12,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    reviewContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    ratingContainer2: {
        right: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    reviewText: {
        fontSize: 14,
        fontFamily: "outfit",
    },
    box: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 10,
        borderWidth: 0.7,
        borderColor: Colors.GRAY,
        padding: 12,
        marginBottom: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.WHITE,
        borderWidth: 0.4,
        borderColor: Colors.GRAY,
    },
    username: {
        fontFamily: "outfit-bold",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.81)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "outfit-bold",
        marginBottom: 12,
    },
    starsRow: {
        flexDirection: "row",
        marginBottom: 12,
        justifyContent: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
    },
});
