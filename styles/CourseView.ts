import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
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
        top: verticalScale(50),
        left: moderateScale(20),
        zIndex: 2,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: moderateScale(25),
        padding: moderateScale(6),
    },
    downloadButton: {
        position: "absolute",
        top: verticalScale(50),
        right: moderateScale(20),
        zIndex: 2,
        backgroundColor: Colors.GREEN,
        borderRadius: moderateScale(25),
        padding: moderateScale(6),
    },
});
