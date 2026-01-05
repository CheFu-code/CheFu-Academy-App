import { PrefKey } from '@/constant/Preferences';
import { RenderSwitch } from '@/helpers/renderSwitch';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/EmailAlerts.styles';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderText from '../common/Header';

interface EmailAlertsUIProps {
    preferences: Record<PrefKey, boolean>;
    toggle: (type: PrefKey) => void;
    resetToDefault: () => void;
    loading: boolean;
}

const EmailAlertsUI = ({
    preferences,
    toggle,
    resetToDefault,
    loading,
}: EmailAlertsUIProps) => {
    const { backgroundColor } = useDarkMode();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <HeaderText title="Email Notifications" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <RenderSwitch
                        label="General Updates"
                        subtext="Receive general app news and tips"
                        type="general"
                        preferences={preferences}
                        toggle={toggle}
                    />

                    <RenderSwitch
                        label="Marketing Emails"
                        subtext="Product offers, events, and promotions"
                        type="marketing"
                        preferences={preferences}
                        toggle={toggle}
                    />

                    <RenderSwitch
                        label="Activity Alerts"
                        subtext="Be notified when someone interacts with your content"
                        type="activity"
                        preferences={preferences}
                        toggle={toggle}
                    />

                    <RenderSwitch
                        label="Security Alerts"
                        subtext="Get alerts for logins and account changes"
                        type="security"
                        preferences={preferences}
                        toggle={toggle}
                    />
                </View>
                <TouchableOpacity
                    disabled={loading}
                    style={[styles.resetButton, { opacity: loading ? 0.5 : 1 }]}
                    onPress={resetToDefault}
                >
                    {loading ? (
                        <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                        <Text style={styles.resetButtonText}>
                            Reset to Default
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <Text style={styles.note}>
                Your preferences are saved to your account and device.
            </Text>
        </SafeAreaView>
    );
};

export default EmailAlertsUI;
