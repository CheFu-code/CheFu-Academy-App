import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: verticalScale(20),
    },
    title: {
        color: Colors.RED,
        fontSize: RFValue(22),
        fontFamily: 'outfit-bold',
        marginBottom: verticalScale(3),
    },
    subtitle: {
        textAlign: 'center',
        fontFamily: 'outfit',
        padding: moderateScale(20),
        color: Colors.GRAY,
        fontSize: RFValue(13),
    },
    lottie: {
        width: scale(180),
        height: verticalScale(180),
    },
});
