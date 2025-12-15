import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: moderateScale(15),
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    anyText: {
        fontFamily: 'outfit-bold',
        color: Colors.WHITE,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'outfit-bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.GREEN,
    },
    countdownContainer: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 20,
        gap: 10,
    },
    redirectText: {
        fontSize: 16,
        fontStyle: 'italic',
        marginLeft: 8,
        color: 'white',
    },
});
