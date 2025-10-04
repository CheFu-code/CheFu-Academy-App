import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
        padding: moderateScale(20),
    },
    heading: {
        fontSize: scale(23),
        fontWeight: "bold",
        marginBottom: verticalScale(15),
        color: Colors.PRIMARY,
        marginTop: verticalScale(25),
        textAlign: "center",
    },
    paragraph: {
        fontSize: scale(16),
        lineHeight: verticalScale(24),
        color: "#fff",
        marginBottom: verticalScale(15),
    },
    quote: {
        fontStyle: "italic",
        fontSize: scale(16),
        color: "#666",
        marginVertical: verticalScale(20),
        paddingLeft: moderateScale(10),
        borderLeftWidth: moderateScale(3),
        borderLeftColor: "#ccc",
    },
    buttonContainer: {
        borderRadius: moderateScale(20),
        backgroundColor: Colors.YELLOW,
        padding: moderateScale(10),
        maxWidth: scale(200),
        alignItems: "center",
        alignSelf: "center",
        marginBottom: verticalScale(80),
    },
    buttonText: {
        textAlign: "center",
        padding: verticalScale(5),
        fontFamily: "outfit-bold",
        fontSize: scale(16),
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(8),
        marginTop: verticalScale(20),
    },
    buyMeCoffee: {
        color: Colors.YELLOW,
        fontFamily: "space-mono",
        fontSize: scale(20),
    },
});
