import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        marginBottom: verticalScale(20),
    },
    title: {
        color: Colors.RED,
        fontSize: RFValue(22),
        fontFamily: "outfit-bold",
        marginBottom: verticalScale(8),
    },
    subtitle: {
        color: "#fff",
        fontSize: scale(16),
        textAlign: "center",
        fontFamily: "outfit",
        padding: moderateScale(20),

    },
    lottie: {
        width: scale(180),
        height: verticalScale(180),
    },
});
