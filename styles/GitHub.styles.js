import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { verticalScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        marginTop: verticalScale(20),
        fontSize: RFValue(14),
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
