import { auth } from '@/config/fireConfig';
import { sendEmailVerification } from '@react-native-firebase/auth';

type ErrorModalState = { visible: boolean; title: string; message: string };

type VerifyParams = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setFatalError: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorModal: React.Dispatch<React.SetStateAction<ErrorModalState>>;
};

export const verify = async ({
    setLoading,
    setFatalError,
    setErrorModal,
}: VerifyParams) => {
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
