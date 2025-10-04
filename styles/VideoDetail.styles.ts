import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    video: {
        width: '100%',
        height: verticalScale(300),
        backgroundColor: '#000',
        marginTop: verticalScale(10),
    },
    image: {
        width: '100%',
        height: verticalScale(200),
        backgroundColor: '#000',
        marginTop: verticalScale(10),
    },
    enrollContainer: {
        marginBottom: verticalScale(10),
        marginHorizontal: moderateScale(12),
    },
    options: {
        color: Colors.BLACK,
        fontSize: scale(14),
        fontFamily: 'outfit-bold',
    },
    tabButton: {
        alignItems: 'center',
        borderRadius: moderateScale(8),
        paddingVertical: verticalScale(4),
        paddingHorizontal: moderateScale(12),
    },
    tabButtonActive: {
        backgroundColor: 'white',
        borderWidth: 0.2,
        borderColor: Colors.BLACK,
    },
    section: {
        backgroundColor: Colors.BG_GRAY,
        padding: moderateScale(2),
        borderRadius: moderateScale(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.GRAY,
        marginHorizontal: moderateScale(12),
        marginTop: verticalScale(25),
    },
    title: {
        fontSize: scale(20),
        fontFamily: 'outfit-bold',
        marginVertical: verticalScale(8),
        marginHorizontal: moderateScale(12),
    },
    description: {
        fontSize: scale(16),
        fontFamily: 'outfit',
        marginBottom: verticalScale(20),
        marginHorizontal: moderateScale(12),
    },
    enrollButton: {
        backgroundColor: Colors.GREEN,
        padding: moderateScale(12),
        borderRadius: moderateScale(8),
        alignItems: 'center',
    },
    enrollText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: scale(16),
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        color: Colors.BLACK,
        fontFamily: 'outfit-bold',
        fontSize: scale(18),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    uploadedBy: {
        fontSize: scale(14),
        fontFamily: 'outfit',
        marginLeft: moderateScale(10),
    },
    durationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(5),
    },
    duration: {
        color: Colors.BLACK,
        fontSize: scale(14),
        fontFamily: 'outfit',
    },
    durationContainer: {
        paddingHorizontal: moderateScale(6),
        marginTop: verticalScale(25),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(8),
    },
    uploadedAt: {
        color: Colors.BLACK,
        fontSize: scale(14),
        fontFamily: 'outfit-bold',
    },
    common: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: moderateScale(12),
        marginTop: verticalScale(8),
        alignItems: 'center',
    },
    box: {
        backgroundColor: Colors.BG_GRAY,
        padding: moderateScale(12),
        borderRadius: moderateScale(8),
        marginHorizontal: moderateScale(4),
        height: verticalScale(100),
        width: scale(170),
        borderWidth: 0.6,
        borderColor: Colors.GRAY,
    },
    level: {
        fontSize: scale(16),
        fontFamily: 'outfit',
        color: Colors.BLACK,
    },
    commonText: {
        fontSize: scale(16),
        fontFamily: 'outfit-bold',
        color: Colors.BLACK,
    },
});
