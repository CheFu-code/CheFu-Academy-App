import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BG,
        padding: moderateScale(10),
    },
    subHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: scale(5),
    },
    greeting: {
        fontFamily: 'outfit-bold',
        fontSize: scale(20),
        color: '#fff',
        maxWidth: scale(200),
    },
    subText: {
        fontFamily: 'space-mono',
        fontSize: scale(16),
        color: Colors.GREEN,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: Colors.BG_COLOR,
        borderTopLeftRadius: scale(25),
        borderTopRightRadius: scale(25),
    },
    inputContainer: {
        marginTop: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BG_GRAY,
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        width: '100%',
    },
    modalTitle: {
        fontFamily: 'outfit-bold',
        fontSize: scale(20),
        color: Colors.PRIMARY,
        marginBottom: verticalScale(5),
        margin: scale(13),
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(10),
        backgroundColor: '#222',
        borderRadius: scale(10),
        marginBottom: verticalScale(12),
        elevation: 2,
        marginHorizontal: scale(13),
    },
    modalIcon: {
        marginRight: scale(16),
    },
    modalText: {
        fontFamily: 'outfit',
        fontSize: scale(16),
        color: Colors.PRIMARY,
    },
    search: {
        backgroundColor: Colors.BG_GRAY,
        padding: moderateScale(8),
        borderRadius: scale(20),
        elevation: 5,
    },
    showMoreIcon: {
        padding: moderateScale(5),
        backgroundColor: Colors.BG2,
        borderRadius: scale(15),
        borderWidth: 0.1,
        borderColor: Colors.BG_GRAY,
    },
    text: {
        fontFamily: 'outfit-bold',
        color: Colors.GREEN,
    },
    bellCont: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    badge: {
        position: 'absolute',
        top: verticalScale(-5),
        right: scale(-5),
        backgroundColor: Colors.GREEN,
        borderRadius: scale(8),
        paddingHorizontal: scale(4),
        paddingVertical: verticalScale(1),
        minWidth: scale(14),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: scale(8), // replaced RFValue(8)
        fontFamily: 'outfit-bold',
    },
});
