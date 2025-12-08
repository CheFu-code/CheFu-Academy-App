import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(20),
        justifyContent: 'center',
    },

    inputContainer: {
        position: 'relative',
        marginBottom: verticalScale(10),
    },
    input: {
        borderRadius: scale(8),
        padding: scale(10),
        fontFamily: 'outfit',
        paddingRight: verticalScale(40),
        borderWidth: 0.9,
        borderColor: '#ccc',
    },
    eye: {
        position: 'absolute',
        right: scale(12),
        top: verticalScale(10),
    },
    button: {
        padding: scale(14),
        borderRadius: scale(10),
        alignItems: 'center',
        marginTop: verticalScale(10),
        backgroundColor: Colors.PRIMARY,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'outfit-bold',
        fontSize: RFValue(15),
    },
});
