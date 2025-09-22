import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.PRIMARY,
        paddingBottom: 20,
    },
    header: {
        color: Colors.WHITE,
        fontSize: 20,
        fontFamily: 'outfit-bold',
        maxWidth: 320,
    },
    query: {
        color: Colors.PRIMARY,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyHeader: {
        color: Colors.GRAY,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        fontFamily: 'outfit-bold',
        fontSize: 18,
        textAlign: 'center',
    },
    emptyMessage: {
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: 15,
        marginTop: 25,
    },
    createText: {
        color: Colors.PRIMARY,
        textDecorationLine: 'underline',
    },
    resultContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    category: {
        fontSize: 18,
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
        textTransform: 'capitalize',
        marginBottom: 10,
        maxWidth: 250,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    found: {
        fontFamily: 'outfit',
        color: 'white',
    },
    length: {
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
});
