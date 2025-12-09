import { Colors } from '@/constant/Colors';
import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';

const ACTION_WIDTH = scale(70);

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: scale(20),
        fontWeight: 'bold',
        marginVertical: verticalScale(12),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
        backgroundColor: 'transparent',
        overflow: 'hidden',
        marginBottom: verticalScale(10),
        paddingHorizontal: scale(15),
    },
    unreadCard: {
        backgroundColor: Colors.BG,
        borderRadius: scale(8),
        // paddingHorizontal: scale(8),
    },
    iconContainer: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: Colors.BG_GRAY,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    textContainer: { flex: 1 },
    message: {
        fontSize: scale(13),
        color: Colors.WHITE,
        fontFamily: 'outfit',
    },
    unreadText: { fontFamily: 'outfit-bold', color: Colors.PRIMARY },
    time: { fontSize: scale(11), color: Colors.GRAY, marginTop: verticalScale(2) },
    separator: { height: verticalScale(1), backgroundColor: Colors.GRAY, opacity: 0.4 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: verticalScale(8), fontSize: RFValue(14), color: Colors.GRAY },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        paddingHorizontal: scale(10),
    },
    actionsContainer: { flexDirection: 'row', alignItems: 'center' },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: ACTION_WIDTH,
        height: '100%',
    },
    actionText: { color: Colors.WHITE, fontSize: RFValue(10), marginTop: verticalScale(2) },
});
