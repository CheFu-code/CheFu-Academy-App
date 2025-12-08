import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: verticalScale(15),
        flex: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    backText: {
        fontSize: RFValue(20),
        fontFamily: 'outfit-bold',
    },
    title: {
        fontSize: RFValue(22),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginBottom: verticalScale(15),
    },
    subtitle: {
        fontSize: RFValue(18),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(5),
    },
    paragraph: {
        fontSize: RFValue(14),
        fontFamily: 'outfit',
        color: Colors.GRAY,
        lineHeight: scale(24),
        marginBottom: verticalScale(10),
    },
    footer: {
        marginTop: verticalScale(10),
        fontSize: RFValue(14),
        color: Colors.GRAY,
        fontFamily: 'outfit',
        textAlign: 'center',
    },
});
