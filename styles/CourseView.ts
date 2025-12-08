import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: "100%",
        height: verticalScale(230),
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        borderBottomRightRadius: moderateScale(20),
        borderBottomLeftRadius: moderateScale(20),
        zIndex: 1,
    },
    backButton: {
        position: "absolute",
        top: verticalScale(40),
        left: moderateScale(10),
        zIndex: 2,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: moderateScale(25),
        padding: moderateScale(6),
        flexDirection: "row",
        alignItems: "center",
    },
    downloadButton: {
        position: "absolute",
        top: verticalScale(40),
        right: moderateScale(10),
        zIndex: 2,
        backgroundColor: Colors.GREEN,
        borderRadius: moderateScale(25),
        padding: moderateScale(6),
    },
    backText: {
        fontFamily: "outfit-bold",
        fontSize: RFValue(16),
    },
});
