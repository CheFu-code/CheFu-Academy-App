import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: verticalScale(10),
        fontFamily: 'outfit-bold',
        fontSize: RFValue(16),
        color: Colors.PRIMARY,
    },
    headerText: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(20),
        color: Colors.PRIMARY,
        letterSpacing: scale(1),
        paddingHorizontal: scale(10),
    },
});
