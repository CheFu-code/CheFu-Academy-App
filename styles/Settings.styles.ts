import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: moderateScale(10),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(22),
    },
    icon: {
        backgroundColor: 'gray',
        padding: scale(4),
        borderRadius: scale(20),
    },
    dropdown: {
        position: 'absolute',
        right: scale(20),
        top: scale(75),
        backgroundColor: '#333',
        borderRadius: scale(8),
        zIndex: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        width: scale(100),
    },
    option: {
        padding: scale(10),
        // borderBottomWidth: 1,
        // borderBottomColor: "#444", // I will uncomment out this line when i add more options
        textAlign: 'center',
    },
    optionText: {
        color: '#fff',
        fontFamily: 'outfit-bold',
    },
    heading: {
        fontSize: RFValue(18),
        fontFamily: 'outfit-bold',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(10),
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
        borderBottomWidth: 0.3,
        borderBottomColor: Colors.GRAY,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: RFValue(15),
        fontFamily: 'outfit',
    },
    codeBlock: {
        backgroundColor: '#1e1e1e',
        borderRadius: scale(8),
        padding: scale(8),
        marginTop: verticalScale(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeLabel: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
        fontSize: RFValue(14),
        marginBottom: verticalScale(4),
    },
    codeText: {
        color: '#d4d4d4',
        fontFamily: 'outfit',
        fontSize: RFValue(11),
        letterSpacing: 1.8,
    },
});
