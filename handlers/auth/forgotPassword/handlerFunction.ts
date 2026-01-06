import { auth } from '@/config/firebaseConfig';
import * as Sentry from '@sentry/react-native';
import { useState } from 'react';

export const useForgotHook = () => {
    const [email] = useState('');
    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState({
        visible: false,
        title: '',
        message: '',
    });
    const [errorModalVisible, setErrorModalVisible] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const handleReset = () => {
        if (loading) return;
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            setErrorModalVisible({
                visible: true,
                title: 'Enter Email',
                message: 'Please enter your email address.',
            });
            return;
        }

        setLoading(true);

        auth.sendPasswordResetEmail(cleanEmail)
            .then(() => {
                setLoading(false);
                setSuccessModalVisible({
                    visible: true,
                    title: 'Check Your Email',
                    message: `Password reset link sent to ${cleanEmail}.`,
                });
            })
            .catch((error) => {
                setLoading(false);
                Sentry.captureException(error);

                if (!error || !error.code) {
                    setErrorModalVisible({
                        visible: true,
                        title: 'Error',
                        message: 'An unknown error occurred. Please try again.',
                    });
                    return;
                }
                switch (error.code) {
                    case 'auth/user-not-found':
                        setErrorModalVisible({
                            visible: true,
                            title: 'User Not Found',
                            message: 'No user found with this email.',
                        });
                        break;
                    case 'auth/invalid-email':
                        setErrorModalVisible({
                            visible: true,
                            title: 'Invalid Email',
                            message: 'The email address is not valid.',
                        });
                        break;
                    case 'auth/missing-email':
                        setErrorModalVisible({
                            visible: true,
                            title: 'Missing Email',
                            message: 'Please enter your email address.',
                        });
                        break;
                    case 'auth/network-request-failed':
                        setErrorModalVisible({
                            visible: true,
                            title: 'Network Error',
                            message: 'Please check your internet connection.',
                        });
                        break;
                    default:
                        setErrorModalVisible({
                            visible: true,
                            title: 'Error',
                            message: error.message,
                        });
                }
            });
    };

    return { handleReset };
};
