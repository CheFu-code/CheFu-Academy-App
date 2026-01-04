import useDarkMode from '@/hooks/useDarkMode';
import { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constant/Colors';
import { styles } from '../../styles/ErrorModal.styles';

interface ErrorModalProps {
    visible: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmColor?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    confirmText = 'OK',
    confirmColor = Colors.RED,
}) => {
    const { backgroundColor } = useDarkMode();
    const [pressOutsideModal, setPressOutsideModal] = useState(false);
    useEffect(() => {
        if (pressOutsideModal) {
            onConfirm();
        }
    }, [pressOutsideModal, onConfirm]);

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onConfirm}
            onDismiss={() => setPressOutsideModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor }]}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={onConfirm}
                            style={[
                                styles.button,
                                { backgroundColor: confirmColor },
                            ]}
                        >
                            <Text style={styles.confirmText}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ErrorModal;
