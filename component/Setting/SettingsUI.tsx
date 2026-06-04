import { Colors } from '@/constant/Colors';
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
    safeBack,
    setIsOpen,
    isOpen,
    safePush,
    loading,
    setLoading,
    notifications,
    setNotifications,
    showVersion,
    setShowVersion,
    exportUserData,
    toggleSetting,
    useBiometrics,
    setUseBiometrics,
    handleShare,
    userDetail,
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
            {/* Header + Dropdown Button */}
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

            {/* Dropdown Menu */}
            {isOpen && (
                <View style={styles.dropdown}>
                    {options.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                Linking.openURL('mailto:chefu.inc@gmail.com');
                                setIsOpen(false);
                            }}
                            style={styles.option} //when i add more options i should uncomment out these styles on the styles file
                        >
                            <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Settings List */}
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
                    onPress={() => safePush('/privacy')}
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
                    onPress={() => safePush('/about')}
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

                {userDetail?.member === true && (
                    <SettingItem
                        label="Subscription & Billing"
                        icon="card-outline"
                        onPress={() => safePush('/subscriptionAndBilling')}
                    />
                )}

                <SettingItem
                    label="Buy me coffee"
                    icon="exit"
                    onPress={async () => {
                        safePush('/buyMeCoffee');
                    }}
                />
                <SettingItem
                    label="Log Out"
                    icon="exit-outline"
                    onPress={() => handleLogout()}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsUI;
