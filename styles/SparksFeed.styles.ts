import { Colors } from '@/constant/Colors';
import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    list: {
        padding: scale(15),
        flexGrow: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    card: {
        padding: scale(10),
        marginBottom: moderateScale(12),
        borderRadius: scale(12),
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowRadius: 8,
        shadowOffset: { width: moderateScale(2), height: verticalScale(2) },
        borderWidth: scale(0.6),
        borderColor: Colors.BG_GRAY,
        backgroundColor: Colors.BG_GRAY,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: moderateScale(8),
    },
    category: {
        fontSize: RFValue(10),
        fontWeight: '600',
        color: Colors.PRIMARY,
    },
    categoryCont: {
        backgroundColor: '#8FBC8F20',
        padding: 2,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    timestamp: {
        fontSize: RFValue(10),
        color: '#888',
    },
    title: {
        fontSize: RFValue(15),
        fontWeight: '700',
        marginBottom: verticalScale(6),
    },
    content: {
        fontSize: RFValue(13),
        color: '#333',
        marginBottom: verticalScale(10),
    },
    author: {
        fontSize: RFValue(12),
        color: '#555',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: verticalScale(6),
        borderTopWidth: scale(0.2),
        borderColor: Colors.GRAY,
        paddingTop: verticalScale(8),
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        backgroundColor: Colors.BG_GRAY,
        padding: verticalScale(8),
        borderRadius: 10,
        paddingHorizontal: verticalScale(18),
        opacity: 0.6,
    },
    actionText: {
        fontSize: RFValue(12),
        color: Colors.PRIMARY,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    NoSparkFeedHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoSparkFeedText: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(16),
        color: Colors.GRAY,
    },
});
