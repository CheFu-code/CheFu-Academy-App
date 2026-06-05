import { Colors } from '@/constant/Colors';
import {
    ACADEMY_PRIVACY_URL,
    ACADEMY_TERMS_URL,
    ACADEMY_WEB_BILLING_URL,
} from '@/constant/links';
import { options } from '@/constant/random';
import useDarkMode from '@/hooks/useDarkMode';
import { chefuAccountManageUrl } from '@/services/ssoAuth';
import { styles } from '@/styles/Settings.styles';
import { SettingsUIProps } from '@/types/settingUI';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import HeaderText from '../common/Header';
import SettingItem from './settingItem';

const SettingsUI = ({
    setIsOpen,
    isOpen,
    safePush,
    loading,
    logoutLoading,
    notifications,
    setNotifications,
    showVersion,
    setShowVersion,
    exportUserData,
    toggleSetting,
    useBiometrics,
    setUseBiometrics,
    handleShare,
    handleLogout,
}: SettingsUIProps) => {
    const { color, backgroundColor } = useDarkMode();
    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor,
                },
            ]}
        >
            <View style={styles.header}>
                <HeaderText title="Settings" />

                <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                    <MaterialIcons
                        name="unfold-more"
                        size={scale(22)}
                        style={styles.icon}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            {isOpen && (
                <View style={styles.dropdown}>
                    {options.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                Linking.openURL('mailto:chefu.inc@gmail.com');
                                setIsOpen(false);
                            }}
                            style={styles.option}
                        >
                            <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.container}
            >
                <Text
                    style={[styles.heading, { color, marginTop: 0 }]}
                >
                    General
                </Text>

                <SettingItem
                    label="Edit Profile"
                    icon="person"
                    onPress={() => safePush('/editProfile')}
                />
                <SettingItem
                    label="Manage CheFu Account"
                    icon="person-circle-outline"
                    onPress={() => Linking.openURL(chefuAccountManageUrl())}
                />
                <SettingItem
                    label="Export My Data"
                    icon="share-outline"
                    onPress={exportUserData}
                    disabled={loading}
                />

                {loading && (
                    <ActivityIndicator
                        size="small"
                        color={Colors.PRIMARY}
                        style={{
                            marginBottom: verticalScale(10),
                            marginTop: verticalScale(10),
                        }}
                    />
                )}

                <Text style={[styles.heading, { color }]}>
                    Notifications
                </Text>
                <SettingItem
                    label="Push Notifications"
                    icon="notifications"
                    toggle
                    value={notifications}
                    onToggle={() =>
                        toggleSetting(
                            'Notifications',
                            setNotifications,
                            notifications,
                        )
                    }
                />
                <SettingItem
                    label="Email Alerts"
                    icon="mail"
                    onPress={() => safePush('/emailAlerts')}
                />

                <Text style={[styles.heading, { color }]}>
                    Privacy & Security
                </Text>
                <SettingItem
                    label="Privacy Policy"
                    icon="shield-checkmark"
                    onPress={() => Linking.openURL(ACADEMY_PRIVACY_URL)}
                />
                <SettingItem
                    label="Enable Biometric Lock"
                    icon="finger-print"
                    toggle
                    value={useBiometrics}
                    onToggle={() =>
                        toggleSetting(
                            'Biometric Lock',
                            setUseBiometrics,
                            useBiometrics,
                        )
                    }
                />
                <SettingItem
                    label="Permissions"
                    icon="lock-open"
                    onPress={() => safePush('/permissions')}
                />

                <SettingItem
                    label="Trusted Devices"
                    icon="hardware-chip"
                    onPress={() => safePush('/trustedDevices')}
                    disabled={loading}
                />

                <Text style={[styles.heading, { color }]}>
                    About
                </Text>
                <SettingItem
                    label="About this App"
                    icon="information-circle-outline"
                    onPress={() => safePush('/about')}
                />
                <SettingItem
                    label="Help & Support"
                    icon="help-circle-outline"
                    onPress={() => {
                        Linking.openURL(
                            'mailto:chefu.inc@gmail.com?subject=Support Request&body=Please describe your issue here.',
                        );
                    }}
                />
                <SettingItem
                    label="Terms of Service"
                    icon="document-text-outline"
                    onPress={() => Linking.openURL(ACADEMY_TERMS_URL)}
                />
                <SettingItem
                    label="App Version"
                    icon="information-circle"
                    onPress={() => setShowVersion(!showVersion)}
                />
                {showVersion && (
                    <View style={styles.codeBlock}>
                        <Text style={styles.codeLabel}>version:</Text>
                        <Text style={styles.codeText}>
                            {Constants.expoConfig?.version ?? 'N/A'}
                        </Text>
                    </View>
                )}

                <SettingItem
                    label="Share CheFu Academy"
                    icon="share-social"
                    onPress={() => handleShare()}
                />

                <Text style={[styles.heading, { color }]}>
                    Account
                </Text>

                <SettingItem
                    label="Academy Billing"
                    icon="card-outline"
                    onPress={() => Linking.openURL(ACADEMY_WEB_BILLING_URL)}
                />

                <SettingItem
                    label={logoutLoading ? 'Logging Out...' : 'Log Out'}
                    icon="exit-outline"
                    onPress={() => handleLogout()}
                    disabled={logoutLoading}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsUI;
