import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: moderateScale(16),
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(8),
        marginBottom: verticalScale(16),
    },
    backButtonText: {
        color: Colors.WHITE,
        fontSize: scale(18),
        fontFamily: "outfit-bold",
    },
    emptyBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: Colors.GRAY,
        fontSize: scale(16),
        fontFamily: "outfit",
    },
    courseCard: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        marginTop: verticalScale(10),
        width: "49%",
        marginRight: "1%",
    },
    courseTitle: {
        fontSize: scale(16),
        color: Colors.PRIMARY,
        fontFamily: "outfit-bold",
    },
    courseCategory: {
        fontSize: scale(14),
        color: Colors.GRAY,
    },
    bannerImage: {
        width: "100%",
        height: verticalScale(100),
        borderRadius: moderateScale(10),
    },
    chapterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: moderateScale(18),
    },
    chapter: {
        fontSize: scale(14),
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
    },
    time: {
        fontSize: scale(10),
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
        marginRight: moderateScale(5),
    },
    loader: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: "space-between",
        minHeight: verticalScale(80),
    },
    completedBadge: {
        fontSize: scale(12),
        color: Colors.GREEN,
        fontFamily: "outfit-bold",
    },
    checkmark: {
        position: "absolute",
        top: verticalScale(10),
        right: moderateScale(12),
        zIndex: 10,
    },
});
