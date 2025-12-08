import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(10),
    },
    heading: {
        fontSize: RFValue(20),
        fontFamily: "outfit-bold",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: verticalScale(20),
        gap: scale(8),
    },
    label: {
        fontSize: RFValue(15),
        fontFamily: "outfit-bold",
    },
    subtext: {
        fontSize: RFValue(12),
        fontFamily: "outfit",
    },
    note: {
        marginTop: verticalScale(5),
        marginBottom: verticalScale(3),
        fontSize: RFValue(13),
        color: "#888",
        fontFamily: "outfit",
        textAlign: "center",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    resetButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(10),
        alignItems: "center",
        marginTop: verticalScale(10),
    },
    resetButtonText: {
        color: "#fff",
        fontFamily: "outfit-bold",
        fontSize: RFValue(15),
    },
    header: {
        alignItems: 'center',
        marginBottom: verticalScale(20),
        justifyContent: 'center',
        marginTop: verticalScale(20),
    }
});
