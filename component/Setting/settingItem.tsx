import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    Pressable,
    useColorScheme,
} from 'react-native';
import React from 'react';
import { styles } from '@/styles/Settings.styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constant/Colors';
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
    const textColor = scheme === 'dark' ? Colors.WHITE : Colors.BLACK;

    return (
        <View
            accessible={true}
            accessibilityRole={toggle ? 'switch' : 'button'}
            accessibilityLabel={label}
            style={{ opacity: disabled ? 0.5 : 1 }}
        >
            <TouchableOpacity
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
                style={styles.itemRow}
            >
                <View style={styles.itemLeft}>
                    <Ionicons
                        name={label === 'Buy me coffee' ? 'cafe-outline' : icon}
                        size={scale(20)}
                        color={label === 'Log Out' ? 'red' : Colors.PRIMARY}
                        style={{ marginRight: verticalScale(10) }}
                    />
                    <Text
                        style={[
                            styles.label,
                            { color: textColor },
                            label === 'Log Out'
                                ? { color: 'red', fontFamily: 'outfit-bold' }
                                : null,
                        ]}
                    >
                        {label}
                    </Text>
                </View>

                {toggle ? (
                    <Switch
                        value={value}
                        onValueChange={disabled ? undefined : onToggle}
                    />
                ) : (
                    <Pressable
                        onPress={disabled ? undefined : onPress}
                        disabled={disabled}
                    >
                        <MaterialIcons
                            name="chevron-right"
                            size={scale(22)}
                            color={Colors.GRAY}
                        />
                    </Pressable>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default SettingItem;
