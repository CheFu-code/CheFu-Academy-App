import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: moderateScale(15),
    },
    backButton: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    header: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(20),
        color: Colors.PRIMARY,
    },
    planValidity: {
        fontFamily: 'outfit',
        fontSize: RFValue(14),
        color: Colors.GRAY,
        marginBottom: moderateScale(10),
    },

    planCard: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: moderateScale(18),
        padding: moderateScale(20),
        marginHorizontal: moderateScale(10),
        minWidth: moderateScale(220),
        height: verticalScale(300),
        alignItems: 'flex-start',
        borderWidth: 2,
        borderColor: Colors.BG_GRAY,
    },
    selectedCard: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.LIGHT_GREEN,
        shadowColor: Colors.PRIMARY,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    popularCard: {
        borderColor: Colors.GREEN,
    },
    planName: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(20),
        color: Colors.PRIMARY,
        marginBottom: moderateScale(6),
    },
    planPrice: {
        fontFamily: 'outfit',
        fontSize: RFValue(14),
        color: Colors.GRAY,
        marginBottom: moderateScale(10),
    },
    popularLabel: {
        fontFamily: 'outfit-bold',
        color: Colors.GREEN,
        fontSize: RFValue(14),
        marginBottom: moderateScale(8),
    },
    feature: {
        fontFamily: 'outfit',
        fontSize: RFValue(14),
        color: Colors.PRIMARY,
    },
    subscribeBtn: {
        marginTop: verticalScale(30),
        marginBottom: moderateScale(30),
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(13),
        paddingHorizontal: moderateScale(30),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    subscribeText: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(18),
        color: Colors.LIGHT_GREEN,
        textAlign: 'center',
    },
});
