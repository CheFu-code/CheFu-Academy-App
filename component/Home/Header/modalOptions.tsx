import { Colors } from '@/constant/Colors';
import { modalOptions } from '@/constant/random';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/Header.styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';

const ModalOptions = ({
    handleOption,
}: {
    handleOption: (option: string) => void;
}) => {
    const { backgroundColor } = useDarkMode();
    const [showModal, setShowModal] = useState(false);

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
        >
            <Pressable
                onPress={() => setShowModal(false)}
                style={styles.modalOverlay}
            >
                <View style={[styles.modalSheet, { backgroundColor }]}>
                    <Text style={styles.modalTitle}>Options</Text>
                    <ScrollView
                        showsVerticalScrollIndicator={true}
                        style={{ maxHeight: moderateScale(230) }}
                    >
                        {modalOptions.map(({ label, icon, color }) => (
                            <TouchableOpacity
                                key={label}
                                onPress={() => handleOption(label)}
                                style={styles.modalItem}
                            >
                                <Ionicons
                                    name={icon}
                                    size={scale(22)}
                                    color={color || Colors.PRIMARY}
                                    style={styles.modalIcon}
                                />
                                <Text
                                    style={[
                                        styles.modalText,
                                        color && { color },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
};

export default ModalOptions;
