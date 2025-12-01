import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    headerWrapper: {
        padding: moderateScale(10),
        backgroundColor: Colors.BG_COLOR,
    },
    p: { padding: moderateScale(10), },
    headerText: {
        fontFamily: "outfit-bold",
        fontSize: moderateScale(22),
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
        elevation: 3,
    },
    textInput: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: "outfit",
        color: Colors.GREEN,
    },
});
