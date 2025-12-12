import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    conditions: {
        textAlign: 'justify',
        color: Colors.WHITE,
        marginTop: verticalScale(40),
        fontSize: RFValue(11),
        fontFamily: 'outfit',
    },
    bottomSheet: {
        padding: moderateScale(20),
        backgroundColor: Colors.PRIMARY,
        borderTopLeftRadius: moderateScale(35),
        borderTopRightRadius: moderateScale(35),
    },
    title: {
        fontSize: RFValue(22),
        textAlign: 'center',
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
    },
    subtitle: {
        fontSize: RFValue(16),
        color: Colors.WHITE,
        marginTop: verticalScale(5),
        textAlign: 'center',
        fontFamily: 'outfit',
    },
    button: {
        padding: moderateScale(12),
        backgroundColor: Colors.WHITE,
        marginTop: verticalScale(20),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(7),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button2: {
        marginTop: verticalScale(10),
        borderWidth: 0.4,
        borderColor: Colors.BG_GRAY,
        borderRadius: moderateScale(30),
        padding: moderateScale(8),
        marginHorizontal: moderateScale(40),
    },
    buttonText: {
        textAlign: 'center',
        fontSize: RFValue(16),
        fontFamily: 'outfit-bold',
    },
    gitHub: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: moderateScale(10),
        marginVertical: verticalScale(15),
        backgroundColor: Colors.BG,
        borderRadius: moderateScale(12),
        paddingVertical: verticalScale(10),
    },

    quote: {
        fontSize: 14,
        fontFamily: 'outfit-regular',
        color: '#999',
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    },


    socialContainer: {
        marginTop: 10,
    },

    socialButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 20,
        marginVertical: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    socialText: {
        fontSize: 16,
        fontFamily: 'outfit-medium',
        color: '#333',
    },

    footer: {
        marginTop: verticalScale(30),
        alignItems: 'center',
        justifyContent: "center"
    },

    footerText: {
        fontSize: RFValue(14),
        fontFamily: 'outfit',
        color: '#aaa',
    },
});
