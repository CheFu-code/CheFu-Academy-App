import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    cardWrapper: {
        position: "relative",
        marginVertical: verticalScale(10),
        backgroundColor: Colors.BG_GRAY,
        borderRadius: moderateScale(10),
    },
    card: {
        overflow: "hidden",
        alignItems: "center",
        width: "100%",
    },
    thumbnail: {
        height: verticalScale(170),
        borderTopLeftRadius: moderateScale(10),
        borderTopRightRadius: moderateScale(10),
        backgroundColor: Colors.GRAY,
        width: "100%",
    },
    title: {
        color: "#000",
        marginTop: verticalScale(5),
        fontSize: RFValue(14),
        fontFamily: "outfit-bold",
        paddingHorizontal: moderateScale(6),
    },
    description: {
        color: Colors.BLACK,
        marginBottom: verticalScale(5),
        fontSize: scale(12),
        fontFamily: "outfit",
        paddingHorizontal: moderateScale(6),
    },
    categoryText: {
        color: "#fff",
        fontFamily: "outfit-bold",
        fontSize:RFValue(12)
    },
    category: {
        position: "absolute",
        top: verticalScale(10),
        left: moderateScale(10),
        zIndex: 10,
        backgroundColor: Colors.GREEN,
        padding: moderateScale(5),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: Colors.BLACK,
    },
    durationContainer: {
        paddingHorizontal: moderateScale(6),
        marginTop: verticalScale(5),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: verticalScale(8),
    },
    duration: {
        color: Colors.BLACK,
        fontSize: scale(12),
        fontFamily: "outfit",
    },
    uploadedAt: {
        color: Colors.BLACK,
        fontSize: scale(12),
        fontFamily: "outfit-bold",
    },
    durationInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(5),
    },
    categoryRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
