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
    headerText: {
        fontFamily: "outfit-bold",
        fontSize: moderateScale(26),
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
        borderRadius: moderateScale(12),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        marginBottom: moderateScale(5),
        elevation: 3,
    },
    textInput: {
        flex: 1,
        fontSize: moderateScale(16),
        fontFamily: "outfit",
        color: Colors.GREEN,
    },
});
