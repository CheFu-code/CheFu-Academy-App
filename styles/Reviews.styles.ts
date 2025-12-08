import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    header: {
        fontSize: RFValue(18),
        marginBottom: verticalScale(8),
        fontFamily: "outfit-bold",
    },
    deleteButton: {
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        gap: moderateScale(10),
    },
    reviewHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    date: {
        fontSize: RFValue(12),
        color: Colors.BLACK,
        fontFamily: "outfit",
    },
    noReviewsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: verticalScale(10),
    },
    noReviewsText: {
        fontFamily: "outfit-bold",
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: moderateScale(8),
        padding: moderateScale(10),
        width: "100%",
        marginBottom: verticalScale(12),
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
    },
    addRating: {
        backgroundColor: Colors.BG_GRAY,
        padding: moderateScale(5),
        borderRadius: moderateScale(15),
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(5),
    },
    reviewContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(10),
    },
    ratingContainer2: {
        right: scale(15),
        flexDirection: "row",
        alignItems: "center",
    },
    reviewText: {
        fontSize: RFValue(14),
        fontFamily: "outfit",
    },
    box: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: moderateScale(10),
        borderWidth: 0.4,
        borderColor: Colors.GRAY,
        padding: moderateScale(12),
        marginBottom: verticalScale(10),
    },
    image: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(50),
        backgroundColor: Colors.WHITE,
        borderWidth: 0.4,
        borderColor: Colors.GRAY,
    },
    username: {
        fontFamily: "outfit-bold",
        fontSize: RFValue(14),
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.81)",
    },
    modalContent: {
        width: "90%",
        borderRadius: moderateScale(12),
        padding: moderateScale(20),
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(4),
        elevation: 5,
    },
    modalTitle: {
        fontSize: RFValue(18),
        fontFamily: "outfit-bold",
        marginBottom: verticalScale(12),
    },
    starsRow: {
        flexDirection: "row",
        marginBottom: verticalScale(12),
        justifyContent: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: moderateScale(10),
    },
    button: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(8),
    },
    buttonText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",
    },
});
