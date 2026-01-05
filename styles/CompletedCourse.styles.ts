import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20),
    },
    header: {
        fontSize: scale(24),
        fontWeight: "bold",
        color: Colors.PRIMARY,
    },
    courseItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.BG_GRAY,
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    courseTitle: {
        fontSize: RFValue(16),
        fontFamily: "outfit-bold",
    },
    courseDate: {
        fontSize: scale(12),
        color: Colors.GREEN,
        marginTop: verticalScale(2),
        fontFamily: "outfit-bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        marginTop: verticalScale(12),
        fontSize: RFValue(18),
        color: Colors.GRAY,
        fontFamily: "outfit-bold",
    },
    button: {
        marginTop: verticalScale(25),
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(8),
        marginBottom: verticalScale(20),
    },
    indicatorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: moderateScale(20),
    },
});