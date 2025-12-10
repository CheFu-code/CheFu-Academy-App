import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
    textInput: {
        width: '100%',
        borderWidth: 1,
        padding: scale(12),
        fontSize: RFValue(14),
        marginTop: verticalScale(15),
        borderRadius: scale(8),
        borderColor: Colors.PRIMARY,
    },
    conditions: {
        textAlign: 'center',
        color: Colors.WHITE,
        marginTop: verticalScale(25),
        fontSize: RFValue(10),
        marginBottom: verticalScale(30),
        fontFamily: 'outfit',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#121212',
        padding: scale(25),
        borderRadius: scale(14),
        alignItems: 'center',
        width: scale(300),
    },
    modalTitle: {
        fontSize: moderateScale(20),
        fontFamily: 'outfit-bold',
        color: Colors.GREEN,
        marginTop: verticalScale(10),
    },
    modalSubtext: {
        fontSize: moderateScale(14),
        color: '#ccc',
        textAlign: 'center',
        marginTop: verticalScale(8),
    },
    logo: {
        width: scale(120),
        height: verticalScale(110),
        borderRadius: scale(75),
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        marginBottom: verticalScale(10),
    },
    title: {
        fontSize: RFValue(26),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    showPassword: {
        fontSize: RFValue(12),
        backgroundColor: Colors.BG_GRAY,
        padding: scale(6),
        borderRadius: scale(8),
        fontFamily: 'outfit',
        textAlign: 'center',
    },
    button: {
        padding: scale(12),
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        borderRadius: scale(8),
        marginTop: verticalScale(20),
    },
    buttonText: {
        fontFamily: 'outfit',
        fontSize: RFValue(16),
        textAlign: 'center',
        color: Colors.WHITE,
    },
});
