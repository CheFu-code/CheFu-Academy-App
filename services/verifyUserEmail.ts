import { auth } from '@/config/firebaseConfig';
import { sendEmailVerification } from '@react-native-firebase/auth';
import { useState } from 'react';

export const useVerifyEmail = () => {
    const user = auth.currentUser;
    const [loading, setLoading] = useState(false);
    const [fatalError, setFatalError] = useState(null);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const verify = async () => {
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

    return { verify };
};
