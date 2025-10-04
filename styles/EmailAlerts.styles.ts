import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: moderateScale(20),
        marginTop: verticalScale(30),
    },
    heading: {
        fontSize: moderateScale(24),
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: verticalScale(20),
        gap: moderateScale(8),
    },
    label: {
        fontSize: moderateScale(16),
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
    },
    subtext: {
        fontSize: moderateScale(13),
        fontFamily: "outfit",
        color: "#aaa",
    },
    note: {
        marginTop: verticalScale(30),
        fontSize: moderateScale(13),
        color: "#888",
        fontFamily: "outfit",
        textAlign: "center",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(10),
        zIndex: 10,
    },
    resetButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(10),
        alignItems: "center",
        marginTop: verticalScale(10),
    },
    resetButtonText: {
        color: "#fff",
        fontFamily: "outfit-bold",
        fontSize: moderateScale(16),
    },
});
