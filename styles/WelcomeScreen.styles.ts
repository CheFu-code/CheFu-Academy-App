import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';

export const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    hero: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(24),
        paddingTop: verticalScale(18),
    },
    heroImage: {
        width: '100%',
        maxWidth: moderateScale(360),
        height: '100%',
        maxHeight: verticalScale(330),
    },
    panel: {
        backgroundColor: Colors.WHITE,
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        paddingHorizontal: moderateScale(22),
        paddingTop: verticalScale(24),
        paddingBottom: verticalScale(18),
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
        elevation: 10,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(10),
        paddingVertical: verticalScale(5),
        borderRadius: moderateScale(8),
        backgroundColor: Colors.LIGHT_YELLOW,
        marginBottom: verticalScale(12),
    },
    badgeText: {
        color: Colors.BG_COLOR,
        fontFamily: 'outfit-bold',
        fontSize: RFValue(11),
    },
    title: {
        color: Colors.BG_COLOR,
        fontFamily: 'outfit-bold',
        fontSize: RFValue(28),
        lineHeight: RFValue(34),
    },
    subtitle: {
        color: '#4b5563',
        fontFamily: 'outfit',
        fontSize: RFValue(14),
        lineHeight: RFValue(21),
        marginTop: verticalScale(10),
    },
    metrics: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(20),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(8),
        backgroundColor: '#f6f8fb',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#dfe7f3',
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    metricValue: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
        fontSize: RFValue(15),
    },
    metricLabel: {
        color: '#6b7280',
        fontFamily: 'outfit',
        fontSize: RFValue(10),
        marginTop: verticalScale(2),
    },
    metricDivider: {
        width: StyleSheet.hairlineWidth,
        height: verticalScale(28),
        backgroundColor: '#d7dde7',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: verticalScale(50),
        marginTop: verticalScale(20),
        borderRadius: moderateScale(8),
        backgroundColor: Colors.BG_COLOR,
    },
    buttonPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.99 }],
    },
    buttonText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: RFValue(15),
    },
    conditions: {
        color: '#6b7280',
        fontFamily: 'outfit',
        fontSize: RFValue(10),
        lineHeight: RFValue(16),
        marginTop: verticalScale(16),
        textAlign: 'center',
    },
    conditionsLink: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
        textDecorationLine: 'underline',
    },
});
