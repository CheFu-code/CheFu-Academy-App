import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: Colors.BG_COLOR,
        flexGrow: 1,
        marginTop: 60,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
    },
    imagePicker: {
        alignSelf: 'center',
        marginBottom: 30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    countryPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    countryPickerButton: {
        flex: 1,
    },
    callingCodeText: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.GREEN,
    },

    imagePlaceholder: {
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        fontWeight: '600',
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 10,
        color: Colors.GREEN,
    },
    bioInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#007bff',
        marginLeft: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
