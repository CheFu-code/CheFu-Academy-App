import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: { flex: 1, padding: moderateScale(20) },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        borderBottomWidth: 1,
        borderBottomColor: Colors.PRIMARY,
        paddingBottom: verticalScale(20),
    },
    header: {
        color: Colors.WHITE,
        fontSize: scale(20),
        fontFamily: 'outfit-bold',
        maxWidth: '85%',
    },
    query: {
        color: Colors.PRIMARY,
        fontStyle: 'italic',
        fontSize: scale(14),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(50),
    },
    emptyHeader: {
        color: Colors.GRAY,
        fontFamily: 'outfit-bold',
        fontSize: scale(18),
        textAlign: 'center',
        marginTop: verticalScale(50),
    },
    emptyMessage: {
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: scale(15),
        marginTop: verticalScale(25),
        textAlign: 'center',
    },
    createText: {
        color: Colors.PRIMARY,
        textDecorationLine: 'underline',
        fontFamily: 'outfit-bold',
        marginTop: verticalScale(10),
    },
    resultContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    category: {
        fontSize: scale(18),
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        textTransform: 'capitalize',
        marginBottom: verticalScale(10),
        maxWidth: '70%',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    found: {
        fontFamily: 'outfit',
        color: Colors.WHITE,
        fontSize: scale(14),
    },
    length: {
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        fontSize: scale(14),
    },
});
