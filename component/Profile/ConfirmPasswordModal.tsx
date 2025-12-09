import { Colors } from '@/constant/Colors';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/Profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { Dispatch, SetStateAction } from 'react';
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { scale } from 'react-native-size-matters';

interface ConfirmPasswordModalProps {
    visible: boolean;
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
    showPassword: boolean;
    setShowPassword: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function ConfirmPasswordModal({
    visible,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    onCancel,
    onConfirm,
    loading,
}: ConfirmPasswordModalProps) {
    const { safePush } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor }]}>
                    <Text style={styles.modalTitle}>Confirm Deletion</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            style={[styles.inputWithIcon, { color: textColor }]}
                            placeholderTextColor="#ccc"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TouchableOpacity
                            onPress={() => setShowPassword((prev) => !prev)}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={scale(20)}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => safePush('/auth/forgotPassword')}
                    >
                        <Text style={styles.forgotPasswordText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[
                                styles.modalButton,
                                { backgroundColor: Colors.GRAY },
                            ]}
                            onPress={onCancel}
                            disabled={loading}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={!password || loading}
                            style={[
                                styles.modalButton,
                                {
                                    backgroundColor: Colors.RED,
                                    opacity: !password ? 0.5 : 1,
                                },
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size={'small'}
                                    color="#fff"
                                />
                            ) : (
                                <Text style={styles.modalButtonText}>
                                    Delete
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
