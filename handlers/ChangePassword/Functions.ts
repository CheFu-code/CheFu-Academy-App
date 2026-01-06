import { db, user } from '@/config/firebaseConfig';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { showToast } from '@/utils/toast';
import { validatePasswordStrength } from '@/utils/validatePassword';
import authModule from '@react-native-firebase/auth';
import { doc, getDoc } from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';
import { useState } from 'react';
import { Alert } from 'react-native';

export const usePasswordHook = () => {
    const { safeBack } = useSafeNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (loading) return;
        if (!user?.email) return;
        const curPwd = currentPassword.trim();
        const newPwd = newPassword.trim();
        const confPwd = confirmPassword.trim();
        const userDocRef = doc(db, 'users', user?.email);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (!curPwd || !newPwd || !confPwd) {
            return showToast('All fields are required');
        }

        if (newPwd !== confPwd) {
            return showToast('Passwords do not match');
        }

        if (!validatePasswordStrength(newPwd)) {
            return showToast('Password must be at least 6 characters');
        }

        if (!user) {
            return showToast('Session expired. Please sign in again.');
        }

        try {
            setLoading(true);
            const credential = authModule.EmailAuthProvider.credential(
                user.email!,
                curPwd,
            );

            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(newPwd);

            showToast('Password updated');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            safeBack();

            if (userData?.emailPreferences?.security === true) {
                await fetch(
                    'https://chefu-academy-tmzx.onrender.com/api/email/send-password-change',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: user?.email,
                            name:
                                userData?.fullname || user?.email.split('@')[0],
                        }),
                    },
                );
                showToast('Password changed successfully');
            } else {
                console.log('no need to send email!');
            }
        } catch (err: any) {
            console.error(err);
            if (typeof Sentry !== 'undefined') Sentry.captureException(err);
            if (err?.code === 'auth/invalid-credential') {
                showToast('Incorrect password. Please try again.');
            } else {
                Alert.alert(err?.message?.toString() || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };
    return { handleChangePassword };
};
