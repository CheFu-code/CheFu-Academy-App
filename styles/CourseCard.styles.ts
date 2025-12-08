import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: moderateScale(10),
        padding: moderateScale(5),
        marginTop: verticalScale(10),
        width: '49%',
    },
    bannerImage: {
        width: '100%',
        height: verticalScale(90),
        borderRadius: moderateScale(10),
    },
    courseTitle: {
        fontSize: RFValue(12),
        fontWeight: 'bold',
        marginTop: verticalScale(5),
        color: Colors.PRIMARY,
    },
    chapterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: moderateScale(16),
    },
    chapter: {
        fontSize: RFValue(12),
        color: Colors.BLACK,
        fontFamily: 'outfit-bold',
    },
    time: {
        fontSize: RFValue(10),
        color: Colors.BLACK,
        fontFamily: 'outfit-bold',
        justifyContent: 'flex-end',
        right: moderateScale(5),
    },
    creatorProfilePicWrapper: {
        position: 'absolute',
        top: verticalScale(5),
        right: moderateScale(5),
        zIndex: 10,
    },
    creatorProfilePic: {
        width: scale(35),
        height: scale(35),
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#ccc',
        borderRadius: scale(20),
    },
    ownerLabel: {
        marginTop: verticalScale(1),
        fontSize: RFValue(8),
        color: Colors.GREEN,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: Colors.GREEN,
        paddingHorizontal: moderateScale(6),
        paddingVertical: moderateScale(2),
        borderRadius: moderateScale(12),
        alignSelf: 'flex-start',
    },
});
