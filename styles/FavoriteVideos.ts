import { Colors } from '@/constant/Colors';
import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(20),
    },
    headerText: {
        fontSize: RFValue(22),
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
    },
    listContainer: {
        padding: moderateScale(16),
    },
    courseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(16),
        padding: moderateScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(4),
        elevation: 3,
    },
    courseImage: {
        width: scale(60),
        height: verticalScale(60),
        borderRadius: moderateScale(8),
        marginRight: moderateScale(10),
        borderWidth: 0.3,
        borderColor: Colors.BLACK,
    },
    courseInfo: {
        flex: 1,
    },
    courseTitle: {
        fontSize: RFValue(16),
        fontWeight: '600',
        color: Colors.PRIMARY,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: RFValue(16),
        color: Colors.GRAY,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(5),
    },
    remove: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(8),
        borderRadius: moderateScale(20),
        backgroundColor: Colors.LIGHT_RED,
        marginLeft: moderateScale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(2),
    },
});
