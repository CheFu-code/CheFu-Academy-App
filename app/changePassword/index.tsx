import { auth, db } from '@/config/fireConfig';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/ChangePassword.styles';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';
import { useState } from 'react';
import {
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import ChangePasswordUI from '@/component/Setting/ChangePasswordUI';
import authModule from '@react-native-firebase/auth';
import { Colors } from '@/constant/Colors';

export default function ChangePassword() {
    const user = auth.currentUser;
    const scheme = useColorScheme();
    const textColor = scheme === 'dark' ? Colors.WHITE : Colors.BLACK;
    const { safeBack } = useSafeNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const validatePasswordStrength = (password: string) => {
        const regex = /^.{6,}$/;
        return regex.test(password);
    };

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
            return ToastAndroid.show(
                'All fields are required',
                ToastAndroid.SHORT,
            );
        }

        if (newPwd !== confPwd) {
            return ToastAndroid.show(
                'Passwords do not match',
                ToastAndroid.SHORT,
            );
        }

        if (!validatePasswordStrength(newPwd)) {
            return ToastAndroid.show(
                'Password must be at least 6 characters',
                ToastAndroid.SHORT,
            );
        }

        if (!user) {
            return ToastAndroid.show(
                'Session expired. Please sign in again.',
                ToastAndroid.SHORT,
            );
        }

        try {
            setLoading(true);
            const credential = authModule.EmailAuthProvider.credential(
                user.email!,
                curPwd,
            );

            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(newPwd);

            ToastAndroid.show('Password updated', ToastAndroid.SHORT);
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
                ToastAndroid.show(
                    'Password changed successfully',
                    ToastAndroid.SHORT,
                );
            } else {
                console.log('no need to send email!');
            }
        } catch (err: any) {
            console.error(err);
            if (typeof Sentry !== 'undefined') Sentry.captureException(err);
            if (err?.code === 'auth/invalid-credential') {
                ToastAndroid.show(
                    'Incorrect password. Please try again.',
                    ToastAndroid.SHORT,
                );
            } else {
                ToastAndroid.show(
                    err?.message?.toString() || 'Something went wrong',
                    ToastAndroid.SHORT,
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (
        label: string,
        value: string,
        setter: (text: string) => void,
        field: 'current' | 'new' | 'confirm',
    ) => (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder={label}
                placeholderTextColor={
                    scheme === 'dark' ? Colors.GRAY : Colors.BLACK
                }
                secureTextEntry={!show[field]}
                value={value}
                onChangeText={setter}
            />
            <TouchableOpacity
                style={styles.eye}
                onPress={() =>
                    setShow((prev) => ({ ...prev, [field]: !prev[field] }))
                }
            >
                <Ionicons
                    name={show[field] ? 'eye-off' : 'eye'}
                    size={scale(20)}
                    color={textColor}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <ChangePasswordUI
            handleChangePassword={handleChangePassword}
            loading={loading}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            renderInput={renderInput}
            safeBack={safeBack}
        />
    );
}
