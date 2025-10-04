import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        borderBottomWidth: 0.7,
        borderBottomColor: Colors.GRAY,
        paddingBottom: verticalScale(5),
    },
    title: {
        color: Colors.WHITE,
        fontSize: scale(18),
        fontFamily: 'outfit-bold',
        maxWidth: '85%',
    },
    queryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: moderateScale(10),
    },
    queryText: {
        color: Colors.GRAY,
        fontStyle: 'italic',
        fontSize: scale(14),
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    found: {
        fontFamily: 'outfit',
        color: Colors.WHITE,
    },
    total: {
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    noResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(50),
        paddingHorizontal: moderateScale(20),
    },
    noResultsText: {
        color: Colors.GRAY,
        fontFamily: 'outfit-bold',
        fontSize: scale(16),
        textAlign: 'center',
        marginTop: verticalScale(20),
    },
    noResultsDescription: {
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: scale(13),
        marginTop: verticalScale(15),
        textAlign: 'center',
    },
    createText: {
        color: Colors.PRIMARY,
        textDecorationLine: 'underline',
        fontFamily: 'outfit-bold',
        marginTop: verticalScale(10),
    },
});
