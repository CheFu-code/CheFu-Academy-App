import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    loadingText: {
        marginTop: verticalScale(10),
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(16),
        color: Colors.PRIMARY,
    },
    headerText: {
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(24),
        color: Colors.PRIMARY,
        letterSpacing: scale(1),
        padding: scale(10),
    },
});
