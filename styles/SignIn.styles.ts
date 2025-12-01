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
        color: '#ffffff',
        borderColor: '#858585',
    },
    passwordInput: {
        flex: 1,
        fontSize: moderateScale(16),
        paddingVertical: verticalScale(12),
        color: '#ffffff',
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: scale(12),
        borderRadius: scale(8),
        borderColor: '#858585',
        marginTop: verticalScale(15),
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
        fontSize: moderateScale(13),
        color: '#ccc',
        textAlign: 'center',
        marginTop: verticalScale(8),
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(10),
        paddingHorizontal: scale(10),
    },
    icons: {
        textAlign: 'center',
        marginVertical: verticalScale(10),
    },
    signInButonContaner: {
        padding: verticalScale(12),
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        borderRadius: scale(10),
        marginTop: verticalScale(20),
    },
    signInButton: {
        fontFamily: 'outfit',
        fontSize: moderateScale(18),
        textAlign: 'center',
        color: Colors.WHITE,
    },
    welcomeText: {
        fontSize: moderateScale(26),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    lottieView: {
        width: scale(160),
        height: scale(160),
        marginBottom: verticalScale(12),
        resizeMode: 'contain',
    },
});
