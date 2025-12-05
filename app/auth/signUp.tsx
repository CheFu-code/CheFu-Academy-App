import SignUpUI from '@/component/auth/SignUpUI';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import { useContext, useState } from 'react';
import {
    Modal,
    Text,
    View
} from 'react-native';
import AppModal from '../../component/Shared/AppModal';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/SignUp.styles';
import { signUpUser } from '../../utils/authService';

interface SignUpResponse {
    user: FirebaseAuthTypes.User;
    userData: {
        fullname?: string;
        lastLogin?: Date;
        updatedAt?: Date;
        profilePicture?: string | null;
        provider?: string;
        [key: string]: unknown;
    };
}

type SignUpResponseOrUndefined = SignUpResponse | undefined;

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [fullNameError, setFullNameError] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserDetail } = useContext(UserDetailContext);
    const { safeReplace } = useSafeNavigation();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (pw: string) => pw.length >= 6;
    const [successModal, setSuccessModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const handleSignUp = async () => {
        if (loading) return;
        setErrorMsg('');

        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setErrorMsg('All fields are required.');
            return;
        }
        if (!validateEmail(email.trim())) {
            setErrorMsg('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(password)) {
            setErrorMsg('Password should be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const response: SignUpResponseOrUndefined = await signUpUser(
                fullName,
                email,
                password,
            );

            if (!response) {
                setErrorMsg('Sign up failed. Please try again.');
                return;
            }

            const { userData } = response;
            setUserDetail(userData);
            setErrorMsg('');
            setSuccessModal({
                visible: true,
                title: 'Account created successfully',
                message:
                    'Please check your inbox to verify your email address — and if it’s not there, don’t forget to look in your spam folder.',
            });
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateFullName = (name: string) => {
        const isValid = /^[a-zA-Z\s-]{1,20}$/.test(name.trim());
        setFullNameError(!isValid);
        return isValid;
    };

    if (loading) {
        return (
            <Modal animationType="fade" transparent={true} visible={loading}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <LottieView
                            source={require('./../../assets/animations/GO TO SCHOOL ANIMATION.json')}
                            autoPlay
                            loop
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={styles.modalTitle}>
                            Creating your account...
                        </Text>
                        <Text style={styles.modalSubtext}>
                            Just a moment while we create your account.
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <>
            <SignUpUI
                fullName={fullName}
                setEmail={setEmail}
                setFullName={setFullName}
                email={email}
                handleSignUp={handleSignUp}
                validateFullName={validateFullName}
                fullNameError={fullNameError}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                errorMsg={errorMsg}
                loading={loading}
            />

            <AppModal
                visible={successModal.visible}
                title={successModal.title}
                message={successModal.message}
                confirmText="OK"
                showCancel={false}
                onCancel={() => {
                    setSuccessModal({ ...successModal, visible: false });
                }}
                onConfirm={() => {
                    setSuccessModal({ ...successModal, visible: false });
                    safeReplace('/(tabs)/home');
                }}
            />
        </>
    );
};

export default SignUp;