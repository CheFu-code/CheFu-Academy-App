import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 0.7,
        borderBottomColor: Colors.GRAY,
        paddingBottom: 5,
    },
    title: {
        color: Colors.WHITE,
        fontSize: RFValue(18),
        fontFamily: 'outfit-bold',
        maxWidth: 320,
    },
    queryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    queryText: {
        color: Colors.PRIMARY,
        fontStyle: 'italic',
        fontSize: RFValue(14),
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    found: {
        fontFamily: 'outfit',
        color: 'white',
    },
    total: {
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    noResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
    },
    noResultsText: {
        color: Colors.GRAY,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        fontFamily: 'outfit-bold',
        fontSize: RFValue(16),
        textAlign: 'center',
    },
    noResultsDescription: {
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: RFValue(13),
        marginTop: 25,
    },
    createText: {
        color: Colors.PRIMARY,
        textDecorationLine: 'underline',
    },
});
