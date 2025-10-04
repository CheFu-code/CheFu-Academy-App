import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    header: {
        fontSize: moderateScale(18),
        marginBottom: verticalScale(8),
        fontFamily: 'outfit-bold',
    },
    description: {
        fontSize: moderateScale(16),
        lineHeight: verticalScale(24),
        fontFamily: 'outfit',
    },
    instructorImage: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        borderWidth: 0.5,
        borderColor: 'black',
    },
    instructorName: {
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(16),
    },
    profilePictureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    topic: {
        marginLeft: scale(8),
        marginBottom: verticalScale(4),
        fontFamily: 'outfit',
        fontSize: moderateScale(16),
    },
});
