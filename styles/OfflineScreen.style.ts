import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        justifyContent: "center",
        alignItems: "center",
        padding: moderateScale(20),
    },
    icon: {
        marginBottom: verticalScale(20),
    },
    title: {
        color: Colors.RED,
        fontSize: scale(24),
        fontFamily: "outfit-bold",
        marginBottom: verticalScale(8),
    },
    subtitle: {
        color: "#fff",
        fontSize: scale(16),
        textAlign: "center",
        fontFamily: "outfit",
    },
    lottie: {
        width: scale(180),
        height: verticalScale(180),
        marginBottom: verticalScale(20),
    },
});
