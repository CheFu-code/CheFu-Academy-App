import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { verticalScale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    message: {
        marginTop: verticalScale(20),
        fontSize: RFValue(14),
        color: Colors.WHITE,
        textAlign: 'center',
        fontFamily: 'outfit-bold',
    },
    errorText: {
        marginTop: verticalScale(20),
        fontSize: RFValue(18),
        color: 'red',
        textAlign: 'center',
        marginHorizontal: verticalScale(20),
        fontFamily: 'outfit-bold',
    },
});
