import { Colors } from '@/constant/Colors';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/SparkDetail';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    visible: boolean;
    editText: string;
    setEditText: (text: string) => void;
    onClose: () => void;
    onSave: () => void;
}

export default function EditModal({
    visible,
    editText,
    setEditText,
    onClose,
    onSave,
}: Props) {
    const { textColor, backgroundColor } = useDarkMode();
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={[styles.modal, { backgroundColor }]}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <View style={styles.editHeader}>
                    <Text style={[styles.editText, { color: textColor }]}>
                        Edit Comment
                    </Text>
                    <TextInput
                        value={editText}
                        onChangeText={setEditText}
                        placeholder="Edit your comment..."
                        placeholderTextColor={Colors.GRAY}
                        style={styles.editInput}
                        multiline
                        numberOfLines={4}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={{ color: Colors.RED }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSave}>
                            <Text style={{ color: Colors.PRIMARY }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}
