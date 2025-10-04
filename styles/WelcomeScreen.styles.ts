import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    conditions: {
        textAlign: 'center',
        color: Colors.WHITE,
        marginTop: verticalScale(30),
        fontSize: scale(11),
        fontFamily: 'outfit',
    },
    bottomSheet: {
        padding: moderateScale(20),
        backgroundColor: Colors.PRIMARY,
        borderTopLeftRadius: moderateScale(35),
        borderTopRightRadius: moderateScale(35),
    },
    title: {
        fontSize: scale(24),
        textAlign: 'center',
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
    },
    subtitle: {
        fontSize: scale(17),
        color: Colors.WHITE,
        marginTop: verticalScale(5),
        textAlign: 'center',
        fontFamily: 'outfit',
    },
    button: {
        padding: moderateScale(15),
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
        fontSize: scale(17),
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
});
