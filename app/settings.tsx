import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { sendEmailVerification } from '@react-native-firebase/auth';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import * as LocalAuthentication from 'expo-local-authentication';

import SettingItem from '@/component/Setting/settingItem';
import { auth, db } from '@/config/fireConfig';
import useDarkMode from '@/hooks/useDarkMode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    Platform,
    ScrollView,
    Share,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import AppModal from '../component/Shared/AppModal';
import { Colors } from '../constant/Colors';
import { UserDetailContext } from '../context/UserDetailContext';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { styles } from '../styles/Settings.styles';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [useBiometrics, setUseBiometrics] = useState(true);
    const [showVersion, setShowVersion] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [fatalError, setFatalError] = useState(null);
    const { safePush, safeBack } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { textColor, backgroundColor } = useDarkMode();
    const CACHE_KEY = '@cached_courses';
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });
    const [successModal, setSuccessModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const options = ['Report a bug']; // when i add more options i should uncomment out these styles on the styles file

    useEffect(() => {
        async function fetchSettings() {
            if (fetching) return;
            setFetching(true);
            try {
                const user = auth.currentUser;
                if (!user?.email) return;

                const docRef = doc(db, 'users', user?.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (!data) return;

                    if (typeof data.notifications === 'boolean') {
                        setNotifications(data.notifications);
                    }

                    if (typeof data.useBiometrics === 'boolean') {
                        setUseBiometrics(data.useBiometrics);
                        await AsyncStorage.setItem(
                            'useBiometrics',
                            data.useBiometrics.toString(),
                        );
                    }
                }
            } catch (error) {
                setFatalError(error);
                console.error('Failed to fetch settings', error);
                if (typeof ToastAndroid !== 'undefined') {
                    ToastAndroid.show(
                        'Failed to fetch settings',
                        ToastAndroid.SHORT,
                    );
                }
            } finally {
                setFetching(false);
            }
        }

        try {
            fetchSettings();
        } catch (err) {
            setFatalError(err);
        }
    }, []);

    const toggleSetting = async (name, stateSetter, current) => {
        try {
            const newValue = !current;

            if (name === 'Biometric Lock') {
                const compatible = await LocalAuthentication.hasHardwareAsync();
                const enrolled = await LocalAuthentication.isEnrolledAsync();

                if (!compatible || !enrolled) {
                    setErrorModal({
                        visible: true,
                        title: 'Biometric Unavailable',
                        message:
                            'Biometric authentication is not available or not set up on this device.',
                    });
                    return;
                }
            }

            stateSetter(newValue);
            setSuccessModal({
                visible: true,
                title: 'Success',
                message: `${name} has been turned ${newValue ? 'on' : 'off'}.`,
            });

            try {
                const user = auth.currentUser;
                if (!user?.email) return;

                const userRef = doc(db, 'users', user.email);

                await updateDoc(userRef, {
                    [name === 'Biometric Lock'
                        ? 'useBiometrics'
                        : 'notifications']: newValue,
                });

                // 👇 Add this immediately after
                if (name === 'Biometric Lock') {
                    await AsyncStorage.setItem(
                        'useBiometrics',
                        newValue.toString(),
                    );
                }
            } catch (error) {
                setFatalError(error);
                console.error('Failed to update setting:', error);
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'Failed to save settings',
                });
            }
        } catch (err) {
            setFatalError(err);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: 'An error occurred while toggling the setting.',
            });
        }
    };

    async function exportUserData() {
        try {
            setLoading(true);
            const user = auth.currentUser;
            if (!user?.email) {
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'User not logged in',
                });
                setLoading(false);
                return;
            }

            const docRef = doc(db, 'users', user.email);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'No user data found to export.',
                });
                setLoading(false);
                return;
            }

            const userData = docSnap.data();
            const json = JSON.stringify(userData, null, 2);
            const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `${FileSystem.documentDirectory}my_chefu_academy_data_${safeEmail}.json`;

            await FileSystem.writeAsStringAsync(filename, json, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            await Sharing.shareAsync(filename, {
                mimeType: 'application/json',
                dialogTitle: 'Export User Data',
                UTI: 'public.json',
            });
        } catch (error) {
            setFatalError(error);
            console.error('Export failed', error);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: 'Failed to export user data.',
            });
        } finally {
            setLoading(false);
        }
    }

    const logOut = async () => {
        try {
            await auth.signOut();
            await AsyncStorage.removeItem('userDetail');
            await AsyncStorage.removeItem(CACHE_KEY);
            await AsyncStorage.removeItem('useBiometrics');
            setUserDetail(null);
        } catch (err) {
            setFatalError(err);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: 'Failed to log out. Please try again.',
            });
        }
        return;
    };

    const SHARE_MESSAGE = 'Check out CheFu Academy App!';
    const SHARE_URL =
        'https://play.google.com/store/apps/details?id=com.chefu.academy';

    const handleShare = async () => {
        try {
            const result = await Share.share({
                title: SHARE_MESSAGE,
                message:
                    Platform.OS === 'ios'
                        ? `${SHARE_MESSAGE} ${SHARE_URL}`
                        : SHARE_MESSAGE,
                url: Platform.OS === 'ios' ? SHARE_URL : undefined,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log(
                        'Shared with activity type:',
                        result.activityType,
                    );
                } else {
                    // shared
                    console.log('Shared successfully!');
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            setFatalError(error);
            setErrorModal({
                visible: true,
                title: 'Sharing Failed',
                message: 'Failed to share content. Please try again.',
            });
        }
    };

    <AppModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        confirmText="OK"
        showCancel={false}
        onConfirm={() => setErrorModal({ ...errorModal, visible: false })}
        onCancel={null}
    />;

    <AppModal
        visible={successModal.visible}
        title={successModal.title}
        message={successModal.message}
        confirmText="OK"
        showCancel={false}
        onConfirm={() => setSuccessModal({ ...successModal, visible: false })}
    />;

    const verify = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                setLoading(true);
                await sendEmailVerification(user);
                alert(
                    `We've sent a verification email to ${user.email}! Check your inbox — and if it’s not there, don’t forget to look in your spam folder.`,
                );
            } catch (error) {
                console.error('Failed to send verification email:', error);
                alert('Failed to send verification email. Try again later.');
            } finally {
                setLoading(false);
            }
        } else {
            setFatalError(
                new Error('No user is currently signed in from settings.'),
            );
            setErrorModal({
                visible: true,
                title: 'Error',
                message: "You're currently not signed in.",
            });
        }
    };
    let content;
    try {
        if (fatalError) {
            content = (
                <View
                    style={[
                        styles.container,
                        {
                            paddingTop: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <Text
                        style={{ color: 'red', fontSize: 18, marginBottom: 20 }}
                    >
                        Something went wrong in Settings.
                    </Text>
                    <Text
                        style={{ color: 'red', fontSize: 14, marginBottom: 20 }}
                    >
                        {fatalError?.message || String(fatalError)}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setFatalError(null);
                        }}
                        style={{
                            backgroundColor: Colors.PRIMARY,
                            padding: 12,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            content = (
                <SafeAreaView
                    style={[
                        styles.container,
                        {
                            backgroundColor: backgroundColor,
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
                            <AntDesign
                                name="left"
                                size={scale(22)}
                                color={textColor}
                            />
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
                                        Linking.openURL(
                                            'mailto:chefu.inc@gmail.com',
                                        );
                                        setIsOpen(false);
                                    }}
                                    style={styles.option} //when i add more options i should uncomment out these styles on the styles file
                                >
                                    <Text style={styles.optionText}>
                                        {item}
                                    </Text>
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
                            style={[
                                styles.heading,
                                { color: textColor, marginTop: 0 },
                            ]}
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
                                onPress={() =>
                                    safePush('/subscriptionAndBilling')
                                }
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
        }
    } catch (err) {
        content = (
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
            >
                <Text style={{ color: 'red', fontSize: 18, marginBottom: 20 }}>
                    A fatal error occurred in Settings.
                </Text>
                <Text style={{ color: 'red', fontSize: 14, marginBottom: 20 }}>
                    {err?.message || String(err)}
                </Text>
            </View>
        );
    }
    return content;
}
