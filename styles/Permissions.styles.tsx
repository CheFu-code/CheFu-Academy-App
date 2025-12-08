import { Colors } from '@/constant/Colors';
import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(15),
    },
    title: {
        fontSize: RFValue(20),
        fontFamily: 'outfit-bold',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(14),
        borderBottomColor: Colors.GRAY,
        borderBottomWidth: 0.3,
    },
    label: {
        fontSize: RFValue(15),
        fontFamily: 'outfit',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(5),
        borderRadius: scale(8),
    },
    granted: {
        backgroundColor: 'rgba(0,255,0,0.1)',
    },
    denied: {
        backgroundColor: 'rgba(255,0,0,0.1)',
    },
    buttonText: {
        fontFamily: 'outfit',
    },
    settingsButton: {
        marginTop: verticalScale(30),
        backgroundColor: Colors.PRIMARY,
        padding: scale(12),
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent:"center"
    },
    settingsText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
    },
});
