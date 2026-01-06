import { auth, db } from '@/config/firebaseConfig';
import { support } from '@/constant/random';
import { useFetchUser } from '@/hooks/fetchUserDetail';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { FirebaseAuthError } from '@/types';
import { DeviceInfo } from '@/types/DeviceInfo';
import { validateEmail } from '@/utils/validateEmail';
import { doc, getDoc } from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, Linking, ToastAndroid } from 'react-native';

export const useSignInHook = () => {
    const { safeReplace } = useSafeNavigation();
    const { getUserDetail } = useFetchUser();

    const [email] = useState('');
    const [password] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSignIn = async () => {
        if (loading) return;

        const cleanEmail = email.trim().toLowerCase();
        setEmailError('');
        setPasswordError('');

        if (!cleanEmail) {
            setEmailError('Please enter your email');
            return;
        }
        if (!validateEmail(cleanEmail)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        if (!password) {
            setPasswordError('Please enter your password');
            return;
        }

        setLoading(true);
        try {
            const resp = await auth.signInWithEmailAndPassword(
                cleanEmail,
                password,
            );
            const signedInEmail = resp.user.email;

            // 🔔 1. Get FCM token
            const fcmToken = await messaging().getToken();

            if (fcmToken) {
                // 🔥 2. Save to Firestore backend (use your own endpoint)
                await fetch(
                    'https://chefu-academy-tmzx.onrender.com/api/save-fcm-token',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: signedInEmail,
                            fcmToken,
                        }),
                    },
                );
            } else {
                console.warn('⚠️ No FCM token received.');
            }

            const deviceInfo = {
                brand: Device.brand,
                modelName: Device.modelName,
                osName: Device.osName,
                osVersion: Device.osVersion,
                deviceType: Device.deviceType,
            };

            // 2. Get location info
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            let locationInfo = {};
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                locationInfo = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
            } else {
                Alert.alert(
                    'Please grant location permission to protect your account.',
                );
            }

            if (!signedInEmail) {
                throw new Error('User email is missing');
            }

            await getUserDetail(signedInEmail);

            safeReplace('/(tabs)/home');
            ToastAndroid.show('Signed in successfully', ToastAndroid.SHORT);

            const userDocRef = doc(db, 'users', signedInEmail);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
            const previousDevices = userDoc.data()?.trustedDevices || [];
            const currentDevice = deviceInfo; // e.g. brand + model + os

            // Check if device is new
            const isNewDevice = !previousDevices.some(
                (d: DeviceInfo) =>
                    d.brand === currentDevice.brand &&
                    d.modelName === currentDevice.modelName &&
                    d.osName === currentDevice.osName &&
                    d.osVersion === currentDevice.osVersion,
            );

            if (isNewDevice && userData?.emailPreferences?.security === true) {
                // Send alert email
                await fetch(
                    'https://chefu-academy-tmzx.onrender.com/api/email/send-alert',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: signedInEmail,
                            name:
                                userData?.fullname ||
                                signedInEmail.split('@')[0],
                            device: deviceInfo,
                            location: locationInfo,
                        }),
                    },
                );
                // Update trusted devices and locations
                await userDocRef.update({
                    trustedDevices: [...previousDevices, currentDevice],
                });

                console.log('alert email sent');
            } else {
                console.log('no need to send alert email');
            }
        } catch (e: unknown) {
            Sentry.captureException(e);
            const contactSupport = () => Linking.openURL(`mailto:${support}`);

            if (typeof e === 'object' && e !== null && 'code' in e) {
                const error = e as FirebaseAuthError;

                switch (e.code) {
                    case 'auth/operation-not-allowed':
                        Alert.alert(
                            'Login Not Enabled',
                            'Email/password accounts are not enabled. Please contact support.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Contact Now',
                                    onPress: contactSupport,
                                },
                            ],
                        );
                        break;
                    case 'auth/invalid-credential':
                        ToastAndroid.show(
                            'Invalid credentials. Please try again.',
                            ToastAndroid.SHORT,
                        );
                        break;
                    case 'auth/unknown':
                        Alert.alert(
                            'Unknown Error',
                            'We encountered an unknown error. Please try again later',
                        );
                        break;
                    case 'auth/network-request-failed':
                        Alert.alert(
                            'Network Error',
                            'Please check your internet connection and try again.',
                        );
                        break;
                    case 'auth/too-many-requests':
                        Alert.alert(
                            'Error',
                            'Too many requests have been made from this device.',
                        );
                        break;
                    case 'auth/internal-error':
                        Alert.alert(
                            'Error',
                            error.message ||
                                'Please try again or contact support.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Contact', onPress: contactSupport },
                            ],
                        );
                        break;
                    default:
                        Alert.alert(
                            'Error',
                            error.message || 'An unexpected error occurred.',
                        );
                        break;
                }
            } else {
                Alert.alert('Error', 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return { handleSignIn };
};
