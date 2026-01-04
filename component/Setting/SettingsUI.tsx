import { auth } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { options } from '@/constant/random';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/Settings.styles';
import { SettingsUIProps } from '@/types/settingUI';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
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
import SettingItem from './settingItem';

const SettingsUI = ({
    safeBack,
    setIsOpen,
    isOpen,
    safePush,
    loading,
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
    verify,
    logOut,
}: SettingsUIProps) => {
    const { textColor, backgroundColor } = useDarkMode();
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
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scale(5),
                    }}
                    onPress={safeBack}
                >
                    <AntDesign name="left" size={scale(22)} color={textColor} />
                    <Text style={[styles.title, { color: textColor }]}>
                        Settings
                    </Text>
                </TouchableOpacity>

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
                    style={[styles.heading, { color: textColor, marginTop: 0 }]}
                >
                    General
                </Text>

                <SettingItem
                    label="Edit Profile"
                    icon="person"
                    onPress={() => safePush('/editProfile')}
                />
                <SettingItem
                    label="Change Password"
                    icon="lock-closed"
                    onPress={() => safePush('/changePassword')}
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

                <Text style={[styles.heading, { color: textColor }]}>
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

                <Text style={[styles.heading, { color: textColor }]}>
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

                <Text style={[styles.heading, { color: textColor }]}>
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

                <Text style={[styles.heading, { color: textColor }]}>
                    Account
                </Text>

                {userDetail?.member === true && (
                    <SettingItem
                        label="Subscription & Billing"
                        icon="card-outline"
                        onPress={() => safePush('/subscriptionAndBilling')}
                    />
                )}

                {auth.currentUser &&
                    !auth.currentUser.emailVerified &&
                    (loading ? (
                        <ActivityIndicator
                            size={'small'}
                            color={Colors.GREEN}
                        />
                    ) : (
                        <SettingItem
                            label="Verify Email"
                            icon="mail"
                            onPress={() => verify()}
                            disabled={
                                !auth.currentUser ||
                                auth.currentUser.emailVerified
                            }
                        />
                    ))}

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
                    onPress={() => logOut()}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsUI;
