import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { scale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    chapterText: {
        fontFamily: "outfit",
        fontSize: RFValue(15),
    },
    buttonContainer: {
        marginVertical: 8,
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "solid",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chapterTextContent: {
        fontFamily: "outfit-bold",
        fontSize: RFValue(18),
    },
    chapterNameContainer: {
        display: "flex",
        flexDirection: "row",
        gap: scale(5),
    },
});
