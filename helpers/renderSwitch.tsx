import { Colors } from '@/constant/Colors';
import { DEFAULT_PREFS } from '@/constant/Preferences';
import { styles } from '@/styles/EmailAlerts.styles';
import { Switch, Text, useColorScheme, View } from 'react-native';

type RenderSwitchProps = {
    label: string;
    subtext: string;
    type: keyof typeof DEFAULT_PREFS; // "general" | "marketing" | "activity" | "security"
    preferences: typeof DEFAULT_PREFS;
    toggle: (type: keyof typeof DEFAULT_PREFS) => void;
};

export function RenderSwitch({
    label,
    subtext,
    type,
    preferences,
    toggle,
}: RenderSwitchProps) {
    const scheme = useColorScheme();
    const color = scheme === 'dark' ? Colors.WHITE : Colors.BLACK;

    return (
        <View style={styles.switchContainer} key={type}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color }]}>
                    {label}
                </Text>
                <Text style={[styles.subtext, { color: Colors.GRAY }]}>
                    {subtext}
                </Text>
            </View>
            <Switch
                trackColor={{ false: '#767577', true: Colors.PRIMARY }}
                thumbColor={preferences[type] ? '#fff' : '#f4f3f4'}
                onValueChange={() => toggle(type)}
                value={preferences[type]}
            />
        </View>
    );
}
