import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: RFValue(20),
        fontWeight: "bold",
        marginBottom: moderateScale(20),
        color: Colors.PRIMARY,
        marginTop: verticalScale(10),
    },
    paragraph: {
        fontSize: RFValue(14),
        lineHeight: moderateScale(22),
        marginBottom: moderateScale(13),
    },
    quote: {
        fontStyle: "italic",
        fontSize: RFValue(14),
        color: "#666",
        marginVertical: verticalScale(20),
        paddingLeft: moderateScale(10),
        borderLeftWidth: moderateScale(3),
        borderLeftColor: "#ccc",
    },
    buttonContainer: {
        borderRadius: moderateScale(20),
        backgroundColor: Colors.YELLOW,
        paddingHorizontal: moderateScale(20),
        paddingVertical: verticalScale(10),
        maxWidth: moderateScale(200),
        alignItems: "center",
        alignSelf: "center",
        marginBottom: verticalScale(20),
    },
    buttonText: {
        textAlign: "center",
        fontFamily: "outfit-bold",
        fontSize: RFValue(15),
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",

    },
    buyMeCoffee: {
        fontFamily: "outfit-bold",
        fontSize: RFValue(20),
    },
});
