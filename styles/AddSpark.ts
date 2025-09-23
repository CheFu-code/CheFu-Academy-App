import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    scroll: {
        paddingVertical: 10,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    label: {
        fontSize: 16,
        fontFamily: 'outfit',
        marginBottom: 8,
        color: Colors.WHITE,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#eee',
        marginRight: 10,
        left: 10,
    },
    categorySelected: {
        backgroundColor: Colors.PRIMARY,
    },
    categoryText: {
        color: Colors.BLACK,
        fontFamily: 'outfit-medium',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    postButton: {
        marginTop: 30,
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'outfit-bold',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
});