import { StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    fullname: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(20),
    },
    numberOfCourses: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(20),
        textAlign: 'center',
    },
    email: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(14),
    },
    profilePicture: {
        height: scale(100),
        width: scale(100),
        borderRadius: scale(50),
        borderWidth: 1,
        borderColor: Colors.YELLOW,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        padding: scale(10),
    },
    backText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(18),
        maxWidth: scale(200),
    },
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    headerContainer: {
        padding: scale(10),
        marginTop: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(20),
    },
    checkmark: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    box: {
        borderColor: Colors.WHITE,
        borderWidth: 1,
        borderRadius: scale(12),
        backgroundColor: '#cccccc54',
        padding: scale(10),
        maxWidth: scale(120),
        maxHeight: verticalScale(120),
        minWidth: scale(120),
        minHeight: verticalScale(120),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(10),
    },
    bio: {
        color: Colors.WHITE,
        fontFamily: 'outfit',
        fontSize: moderateScale(14),
        marginTop: verticalScale(10),
    },
    common: {
        flexDirection: 'row',
        gap: scale(20),
    },
    boxContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(20),
        borderTopWidth: 1,
        borderTopColor: Colors.WHITE,
        backgroundColor: '#00000054',
    },
    notFound: {
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        fontSize: moderateScale(20),
    },
    notFoundMessage: {
        color: 'gray',
        fontFamily: 'outfit',
        fontSize: moderateScale(14),
        textAlign: 'center',
        marginTop: verticalScale(6),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        padding: scale(10),
    },
    animationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(80),
    },
});
