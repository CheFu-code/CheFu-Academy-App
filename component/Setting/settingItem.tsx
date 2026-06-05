import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/Settings.styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    Switch,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

interface SettingItemProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap; // Use Ionicons icon names
    toggle?: boolean; // optional, defaults to false
    value?: boolean; // value for the Switch
    onToggle?: (value: boolean) => void; // function to handle toggle
    onPress?: () => void; // required for Pressable/Touchable
    disabled?: boolean; // optional
}

const SettingItem = ({
    label,
    icon,
    toggle = false,
    value,
    onToggle,
    onPress,
    disabled,
}: SettingItemProps) => {
    const scheme = useColorScheme();
    const color = scheme === 'dark' ? Colors.WHITE : Colors.BLACK;
    const isDangerAction = label === 'Log Out' || label === 'Logging Out...';

    return (
        <View style={{ opacity: disabled ? 0.5 : 1 }}>
            <TouchableOpacity
                accessible
                accessibilityRole={toggle ? 'switch' : 'button'}
                accessibilityLabel={label}
                accessibilityState={{
                    checked: toggle ? Boolean(value) : undefined,
                    disabled: Boolean(disabled),
                }}
                hitSlop={6}
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
                style={styles.itemRow}
            >
                <View style={styles.itemLeft}>
                    <Ionicons
                        name={icon}
                        size={scale(20)}
                        color={isDangerAction ? 'red' : Colors.PRIMARY}
                        style={{ marginRight: verticalScale(10) }}
                    />
                    <Text
                        style={[
                            styles.label,
                            { color },
                            isDangerAction
                                ? { color: 'red', fontFamily: 'outfit-bold' }
                                : null,
                        ]}
                    >
                        {label}
                    </Text>
                </View>

                {toggle ? (
                    <Switch
                        accessibilityLabel={label}
                        value={value}
                        onValueChange={disabled ? undefined : onToggle}
                    />
                ) : (
                    <MaterialIcons
                        name="chevron-right"
                        size={scale(22)}
                        color={Colors.GRAY}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

export default SettingItem;
