import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    textInput: {
        width: '100%',
        borderWidth: 0.5,
        padding: verticalScale(12),
        fontSize: RFValue(14),
        marginTop: verticalScale(15),
        borderRadius: scale(8),
        borderColor: '#858585',
    },
    passwordInput: {
        flex: 1,
        fontSize: RFValue(14),
        paddingVertical: verticalScale(12),
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
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
        padding: scale(25),
        borderRadius: scale(14),
        alignItems: 'center',
        width: scale(300),
    },
    modalTitle: {
        fontSize: RFValue(18),
        fontFamily: 'outfit-bold',
        color: Colors.GREEN,
        marginTop: verticalScale(10),
    },
    modalSubtext: {
        fontSize: RFValue(12),
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
    signInButtonContainer: {
        padding: verticalScale(12),
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        borderRadius: scale(10),
        marginTop: verticalScale(20),
    },
    signInButton: {
        fontFamily: 'outfit',
        fontSize: RFValue(17),
        textAlign: 'center',
        color: Colors.WHITE,
    },
    welcomeText: {
        fontSize: RFValue(24),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    lottieView: {
        width: scale(160),
        height: verticalScale(160),
        marginBottom: verticalScale(12),
        resizeMode: 'contain',
    },
});
