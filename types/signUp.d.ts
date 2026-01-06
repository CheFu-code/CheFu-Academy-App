import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type SignUpUIProps = {
    fullName: string;
    fullNameError?: boolean;
    setFullName: (name: string) => void;
    validateFullName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    loading: boolean;
    handleSignUp: () => void;
    errorMsg?: string;
};

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

export type SignUpResponseOrUndefined = SignUpResponse | undefined;
