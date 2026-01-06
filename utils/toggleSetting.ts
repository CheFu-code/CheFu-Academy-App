import { auth, db } from '@/config/fireConfig';
import { BIOMETRICS } from '@/constant/caches';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from '@react-native-firebase/firestore';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';

export const useToggle = () => {
    const [fatalError, setFatalError] = useState(null);
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

    const toggleSetting = async (name: string, stateSetter, current) => {
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
                        BIOMETRICS,
                        newValue.toString(),
                    );
                }
            } catch (error: any) {
                setFatalError(error);
                console.error('Failed to update setting:', error);
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'Failed to save settings',
                });
            }
        } catch (err: any) {
            setFatalError(err);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: 'An error occurred while toggling the setting.',
            });
        }
    };

    return { toggleSetting };
};
