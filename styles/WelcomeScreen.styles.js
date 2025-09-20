import { StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

export const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
    },
    conditions: {
        textAlign: "center",
        color: Colors.WHITE,
        marginTop: 30,
        fontSize: 14,
        marginBottom: 75,
        fontFamily: "outfit",
    },
    bottomSheet: {
        padding: 25,
        backgroundColor: Colors.PRIMARY,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.WHITE,
    },
    subtitle: {
        fontSize: 20,
        color: Colors.WHITE,
        marginTop: 20,
        textAlign: "center",
        fontFamily: "outfit",
    },
    button: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        marginTop: 20,
        borderRadius: 10,
        marginBottom: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    button2: {
        marginTop: 10,
        borderWidth: 0.4,
        borderColor: Colors.BG_GRAY,
        borderRadius: 30,
        padding: 8,
        marginHorizontal: 40,
    },
    buttonText: {
        textAlign: "center",
        fontSize: 17,
        fontFamily: "outfit-bold",
    },
    gitHub: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginVertical: 15,
        backgroundColor: Colors.BG,
        borderRadius: 12,
        paddingVertical:10
    },
});
