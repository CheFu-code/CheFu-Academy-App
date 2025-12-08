import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    bannerImage: {
        height: verticalScale(50),
        width: scale(60),
        borderRadius: moderateScale(8),
    },
    courseTitle: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(12),
        flexWrap: 'wrap',
        maxWidth: '90%',
    },
    commonStyles: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(5),
    },
    chapter: {
        fontFamily: 'outfit',
        fontSize: RFValue(10),
    },
    activityIndicatorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
