import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    chapterText: {
        fontFamily: "outfit",
        fontSize: moderateScale(16),
    },
    buttonContainer: {
        marginVertical: verticalScale(8),
        padding: moderateScale(15),
        backgroundColor: "#f0f0f0",
        borderRadius: moderateScale(10),
        borderWidth: moderateScale(1),
        borderStyle: "solid",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chapterTextContent: {
        fontFamily: "outfit-bold",
        fontSize: moderateScale(20),
        color: Colors.WHITE,
    },
    chapterNameContainer: {
        flexDirection: "row",
        gap: moderateScale(5),
    },
});
