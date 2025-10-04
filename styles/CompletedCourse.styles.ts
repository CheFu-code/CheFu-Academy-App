import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
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
        fontSize: scale(18),
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
    },
    courseDate: {
        fontSize: scale(14),
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
        fontSize: scale(18),
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
        backgroundColor: Colors.BG_COLOR,
        padding: moderateScale(20),
    },
});