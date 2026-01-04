import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    headerWrapper: {
        paddingHorizontal: moderateScale(10),
    },
    p: { padding: moderateScale(10), },
    headerText: {
        fontFamily: "outfit-bold",
        fontSize: RFValue(20),
        color: Colors.PRIMARY,
    },
    scrollContent: {
        padding: moderateScale(20),
        backgroundColor: Colors.BG_COLOR,
    },
    categoryWrapper: {
        marginTop: moderateScale(10),
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.BG_GRAY,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(6),
        marginBottom: moderateScale(3),
        elevation: 7,
    },
    textInput: {
        flex: 1,
        fontSize: RFValue(13),
        fontFamily: "outfit",
        color: Colors.BLACK,
    },
});
