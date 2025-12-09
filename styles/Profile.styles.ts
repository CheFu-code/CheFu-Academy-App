import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingBottom: verticalScale(20),
    },
    avatar: {
        width: moderateScale(140),
        height: moderateScale(140),
        borderRadius: moderateScale(70),
        borderWidth: moderateScale(2),
        marginBottom: verticalScale(15),
        marginTop: verticalScale(15),
        resizeMode: 'contain',
    },
    profileName: {
        fontSize: RFValue(19),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        maxWidth: scale(250),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileEmail: {
        fontSize: RFValue(13),
        fontFamily: 'outfit',
        maxWidth: scale(250),
        textAlign: 'center',
    },
    planStatus: {
        fontSize: RFValue(13),
        fontFamily: 'outfit',
        marginTop: verticalScale(5),
        color: Colors.WHITE,
    },
    menuSection: {
        paddingHorizontal: moderateScale(20),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(10),
        backgroundColor: '#222',
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(12),
        elevation: 2,
    },
    icon: {
        marginRight: scale(16),
    },
    menuLabel: {
        fontSize: RFValue(15),
        fontFamily: 'outfit',
        color: Colors.PRIMARY,
    },
    divider: {
        height: verticalScale(1),
        backgroundColor: '#444',
        marginVertical: verticalScale(10),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        borderRadius: moderateScale(12),
        padding: moderateScale(20),
    },
    modalTitle: {
        fontSize: RFValue(16),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginBottom: verticalScale(15),
    },
    input: {
        padding: moderateScale(12),
        borderRadius: moderateScale(8),
        fontFamily: 'outfit',
        fontSize: RFValue(13),
        marginBottom: verticalScale(20),
        borderWidth: 0.5,
        borderColor: Colors.GRAY,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: moderateScale(12),
        borderRadius: moderateScale(8),
        marginHorizontal: scale(5),
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontFamily: 'outfit-bold',
        fontSize: RFValue(13),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(8),
        marginBottom: verticalScale(10),
        borderWidth: 0.7,
        borderColor: Colors.GRAY,
    },
    inputWithIcon: {
        flex: 1,
        fontFamily: 'outfit',
        fontSize: RFValue(14),
        paddingRight: scale(10),
    },
    expiryText: {
        fontFamily: 'outfit',
        fontSize: RFValue(13),
        marginTop: verticalScale(5),
        color: '#ccc',
    },
    versionText: {
        textAlign: 'center',
        color: Colors.GRAY,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(20),
        fontFamily: 'outfit',
        fontSize: RFValue(13),
    },
    forgotPasswordText: {
        fontFamily: 'outfit',
        fontSize: RFValue(13),
        color: Colors.GRAY,
        marginBottom: verticalScale(20),
        textAlign: 'right',
        textDecorationLine: 'underline',
        fontStyle: 'italic',
    },
    common: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(2),
    },
});

export const styles2 = StyleSheet.create({
    profileName: {
        fontSize: RFValue(17),
        fontWeight: 'bold',
        color: 'white',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
    },
    modalTitle: {
        fontSize: RFValue(17),
        fontWeight: 'bold',
        marginBottom: verticalScale(15),
    },
    input: {
        backgroundColor: '#333',
        color: 'white',
        borderRadius: moderateScale(8),
        padding: moderateScale(10),
        fontSize: RFValue(13),
        marginBottom: verticalScale(20),
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: scale(10),
    },
    buttonCancel: {
        padding: moderateScale(10),
    },
    buttonSave: {
        padding: moderateScale(10),
        backgroundColor: '#4CAF50',
        borderRadius: moderateScale(8),
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: RFValue(13),
    },
    changingName: {
        width: moderateScale(100),
        height: moderateScale(70),
    },
    changingAvatar: {
        width: moderateScale(200),
        height: moderateScale(200),
    },
});
