export type SignInUIProps = {
    setEmail: (v: string) => void;
    setEmailError: (v: string) => void;
    setPassword: (v: string) => void;
    setPasswordError: (v: string) => void;
    emailError: string;
    passwordError: string;
    email: string;
    password: string;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    googleLoading: boolean;
    handleSignIn: () => void;
    handleGoogleSignIn: () => Promise<void>
};
