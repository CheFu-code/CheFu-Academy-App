import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        paddingVertical: verticalScale(10),
    },
    heading: {
        fontSize: scale(20),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
    },
    label: {
        fontSize: scale(15),
        fontFamily: 'outfit',
        marginBottom: verticalScale(8),
        marginTop: verticalScale(15),
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: scale(10),
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(10),
        fontSize: scale(13),
        marginBottom: verticalScale(15),
        borderWidth: 1,
        borderColor: '#ddd',
        color: Colors.BLACK,
    },
    textArea: {
        height: verticalScale(120),
        textAlignVertical: 'top',
    },
    categoryButton: {
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(8),
        borderRadius: scale(20),
        backgroundColor: '#eee',
        marginRight: scale(10),
        left: scale(10),
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
        marginTop: verticalScale(30),
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(15),
        borderRadius: scale(12),
        alignItems: 'center',
        paddingHorizontal: scale(10),
    },
    postButtonText: {
        color: '#fff',
        fontSize: scale(12),
        fontFamily: 'outfit-bold',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    },
    wordCount: {
        textAlign: 'right',
        color: Colors.GRAY,
    },
});
