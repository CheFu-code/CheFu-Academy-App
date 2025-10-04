import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    textInput: {
        width: '100%',
        borderWidth: 1,
        padding: verticalScale(12),
        fontSize: moderateScale(16),
        marginTop: verticalScale(15),
        borderRadius: scale(8),
        color: Colors.WHITE,
        borderColor: Colors.PRIMARY,
    },
    conditions: {
        textAlign: 'center',
        color: Colors.WHITE,
        marginTop: verticalScale(25),
        fontSize: moderateScale(13),
        marginBottom: verticalScale(60),
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
        width: scale(150),
        height: scale(150),
        borderRadius: scale(75),
        borderWidth: 2,
        borderColor: Colors.PRIMARY,
        marginBottom: verticalScale(15),
    },
    title: {
        fontSize: moderateScale(26),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    showPassword: {
        fontSize: moderateScale(13),
        paddingTop: verticalScale(5),
        backgroundColor: Colors.BG_GRAY,
        padding: scale(8),
        borderRadius: scale(8),
        fontFamily: 'outfit',
        textAlign: 'center',
    },
    button: {
        padding: verticalScale(12),
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        borderRadius: scale(8),
        marginTop: verticalScale(20),
    },
    buttonText: {
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(18),
        textAlign: 'center',
        color: Colors.WHITE,
    },
});
