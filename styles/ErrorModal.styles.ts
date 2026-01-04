import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: moderateScale(30),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        width: scale(300),
    },
    title: {
        fontSize: RFValue(18),
        fontFamily: 'outfit-bold',
        color: Colors.RED,
        marginBottom: verticalScale(10),
    },
    message: {
        fontSize: RFValue(14),
        color: Colors.GRAY,
        textAlign: 'center',
        fontFamily: 'outfit',
        marginBottom: verticalScale(20),
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: moderateScale(10),
    },
    button: {
        flex: 1,
        borderRadius: moderateScale(10),
        paddingVertical: verticalScale(12),
        borderWidth: 1,
        alignItems: 'center',
    },
    confirmText: {
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: moderateScale(14),
    },
    cancelText: {
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(14),
    },
});
