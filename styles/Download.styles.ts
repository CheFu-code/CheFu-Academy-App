import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20),
        backgroundColor: Colors.BG_COLOR,
        marginBottom: verticalScale(30),
    },
    title: {
        fontSize: moderateScale(24),
        fontWeight: "bold",
        marginBottom: verticalScale(15),
        color: Colors.WHITE,
    },
    empty: {
        textAlign: "center",
        color: "gray",
    },
    desc: {
        marginTop: verticalScale(7),
        fontFamily: "outfit",
        borderBottomWidth: moderateScale(2),
        borderBottomColor: Colors.PRIMARY,
        borderLeftWidth: moderateScale(2),
        borderRightWidth: moderateScale(2),
        borderRightColor: Colors.YELLOW,
        padding: moderateScale(10),
        borderTopRightRadius: moderateScale(15),
        borderTopLeftRadius: moderateScale(15),
        borderBottomRightRadius: moderateScale(15),
        borderBottomLeftRadius: moderateScale(15),
        fontSize: moderateScale(16),
    },
    itemBox: {
        backgroundColor: Colors.BG_GRAY,
        padding: moderateScale(15),
        marginTop: verticalScale(10),
        borderRadius: moderateScale(10),
    },
    itemText: {
        fontSize: moderateScale(16),
        fontFamily: "outfit-bold",
        maxWidth: "80%",
    },
    delete: {
        color: "red",
        fontFamily: "outfit-bold",
        textAlign: "center",
        backgroundColor: "gray",
        marginTop: verticalScale(8),
        marginBottom: verticalScale(8),
        padding: moderateScale(8),
        borderRadius: moderateScale(10),
    },
    backButton: {
        position: "absolute",
        top: verticalScale(50), // adjust as needed for safe area
        left: moderateScale(20),
        zIndex: 2,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: moderateScale(25),
        padding: moderateScale(6),
    },
});
