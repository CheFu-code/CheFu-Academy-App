import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    header: {
        fontSize: RFValue(16),
        marginBottom: verticalScale(8),
        fontFamily: 'outfit-bold',
    },
    description: {
        fontSize: RFValue(14),
        lineHeight: verticalScale(24),
        fontFamily: 'outfit',
    },
    instructorImage: {
        width: scale(40),
        height: verticalScale(40),
        borderRadius: scale(20),
        borderWidth: 0.5,
        borderColor: 'black',
    },
    instructorName: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(16),
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
        fontSize: RFValue(14),
    },
});
