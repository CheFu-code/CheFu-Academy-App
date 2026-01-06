import { Colors } from '@/constant/Colors';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/ChangePassword.styles';
import { RenderInputProps } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import {
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { scale } from 'react-native-size-matters';

const RenderInput = ({
    label,
    show,
    setShow,
    field,
    value,
    setter,
}: RenderInputProps) => {
    const scheme = useColorScheme();
    const { color } = useDarkMode();
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, { color }]}
                placeholder={label}
                placeholderTextColor={
                    scheme === 'dark' ? Colors.GRAY : Colors.BLACK
                }
                secureTextEntry={!show[field]}
                value={value}
                onChangeText={setter}
            />
            <TouchableOpacity
                style={styles.eye}
                onPress={() =>
                    setShow((prev) => ({ ...prev, [field]: !prev[field] }))
                }
            >
                <Ionicons
                    name={show[field] ? 'eye-off' : 'eye'}
                    size={scale(20)}
                    color={color}
                />
            </TouchableOpacity>
        </View>
    );
};

export default RenderInput;
