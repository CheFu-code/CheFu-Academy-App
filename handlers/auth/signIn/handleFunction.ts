import { auth, db } from '@/config/firebaseConfig';
import { API_BASE, support } from '@/constant/random';
import { useFetchUser } from '@/hooks/fetchUserDetail';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { FirebaseAuthError } from '@/types';
import { DeviceInfo } from '@/types/DeviceInfo';
import { buildDeviceInfo } from '@/utils/buildDeviceInfo';
import { validateEmail } from '@/utils/validateEmail';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, Linking, ToastAndroid } from 'react-native';

export const useSignInHook = () => {
    const { safeReplace } = useSafeNavigation();
    const { getUserDetail } = useFetchUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false); // google
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSignIn = async (): Promise<void> => {
        if (loading || googleLoading) return;

        const normalizedEmail = email.trim().toLowerCase();

        setEmailError('');
        setPasswordError('');

        // -----------------------------
        // 1. Input Validation (Fail Fast)
        // -----------------------------
        if (!normalizedEmail) {
            setEmailError('Please enter your email');
            return;
        }

        if (!validateEmail(normalizedEmail)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setPasswordError('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            // -----------------------------
            // 2. Authenticate User
            // -----------------------------
            const credential = await signInWithEmailAndPassword(
                auth,
                normalizedEmail,
                password,
            );

            const signedInEmail = credential?.user?.email;
            if (!signedInEmail) {
                throw new Error('Authenticated user email missing');
            }

            // -----------------------------
            // 3. Parallel Non-Blocking Tasks
            // -----------------------------
            const [fcmToken, locationPermission] = await Promise.all([
                getToken(getMessaging()).catch(() => null),
                Location.requestForegroundPermissionsAsync(),
            ]);

            // -----------------------------
            // 4. Save FCM Token (Best Effort)
            // -----------------------------
            if (fcmToken) {
                fetch(
                    'https://chefu-academy-tmzx.onrender.com/api/save-fcm-token',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: signedInEmail,
                            fcmToken,
                        }),
                    },
                ).catch(() => {
                    // Silent failure — do not block login
                    console.warn('Failed to save FCM token');
                });
            }

            // -----------------------------
            // 5. Device & Location Context
            // -----------------------------

            let locationInfo: { latitude?: number; longitude?: number } = {};

            if (locationPermission.status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                locationInfo = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
            }

            // -----------------------------
            // 6. Fetch User Profile
            // -----------------------------
            await getUserDetail(signedInEmail);

            const userDocRef = doc(db, 'users', signedInEmail);
            const userSnap = await getDoc(userDocRef);

            if (!userSnap.exists()) {
                throw new Error('User record not found');
            }

            const userData = userSnap.data();
            const trustedDevices: DeviceInfo[] = userData?.trustedDevices ?? [];
            const deviceInfo = buildDeviceInfo();

            // -----------------------------
            // 7. New Device Detection
            // -----------------------------
            const isNewDevice = !trustedDevices.some(
                (d) =>
                    d.brand === deviceInfo.brand &&
                    d.modelName === deviceInfo.modelName &&
                    d.osName === deviceInfo.osName &&
                    d.osVersion === deviceInfo.osVersion,
            );

            // -----------------------------
            // 8. Security Alert (If Enabled)
            // -----------------------------
            if (isNewDevice && userData?.emailPreferences?.security === true) {
                try {
                    const response = await fetch(
                        `${API_BASE}/api/email/send-alert`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: signedInEmail,
                                name:
                                    userData?.fullname ??
                                    signedInEmail.split('@')[0],
                                device: deviceInfo,
                                location: locationInfo,
                            }),
                        },
                    );

                    if (!response.ok) {
                        Sentry.captureMessage('Security alert email failed', {
                            extra: {
                                status: response.status,
                                email: signedInEmail,
                            },
                        });
                    }
                } catch (err) {
                    Sentry.captureException(err);
                }

                // 🔐 Always update trusted devices
                await updateDoc(userDocRef, {
                    trustedDevices: arrayUnion(deviceInfo),
                });
            }

            // -----------------------------
            // 9. Navigate Only After Security Checks
            // -----------------------------
            safeReplace('/(tabs)/home');
        } catch (error: unknown) {
            // -----------------------------
            // 10. Observability
            // -----------------------------
            Sentry.captureException(error);

            const contactSupport = () => Linking.openURL(`mailto:${support}`);

            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error
            ) {
                const firebaseError = error as FirebaseAuthError;

                switch (firebaseError.code) {
                    case 'auth/operation-not-allowed':
                        Alert.alert(
                            'Login Disabled',
                            'Email/password login is disabled.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Contact Support',
                                    onPress: contactSupport,
                                },
                            ],
                        );
                        break;

                    case 'auth/invalid-credential':
                        ToastAndroid.show(
                            'Invalid email or password.',
                            ToastAndroid.SHORT,
                        );
                        break;

                    case 'auth/network-request-failed':
                        Alert.alert(
                            'Network Error',
                            'Please check your internet connection.',
                        );
                        break;

                    case 'auth/too-many-requests':
                        Alert.alert(
                            'Too Many Attempts',
                            'Please wait before trying again.',
                        );
                        break;

                    default:
                        Alert.alert(
                            'Login Failed',
                            firebaseError.message ??
                                'An unexpected error occurred.',
                        );
                }
            } else {
                Alert.alert(
                    'Unexpected Error',
                    'Something went wrong. Please try again.',
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (loading || googleLoading) return;

        setGoogleLoading(true);
        try {
            safeReplace('/auth/google'); // ✅ hooks are valid here
        } finally {
            setGoogleLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        googleLoading,
        emailError,
        setEmailError,
        passwordError,
        setPasswordError,
        handleSignIn,
        handleGoogleSignIn,
    };
};
