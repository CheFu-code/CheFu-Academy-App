import FatalError from '@/component/auth/fatalError';
import Loading from '@/component/auth/Loading';
import SignInUI from '@/component/auth/SignInUI';
import { useSignInHook } from '@/handlers/auth/signIn/handleFunction';
import { useState } from 'react';

const SignIn = () => {
    const { handleSignIn } = useSignInHook();
    
    const [loading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [fatalError, setFatalError] = useState<Error | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    if (loading) {
        return <Loading loading={loading} />;
    }

    if (fatalError) {
        return (
            <FatalError fatalError={fatalError} setFatalError={setFatalError} />
        );
    }

    return (
        <SignInUI
            setEmail={setEmail}
            setEmailError={setEmailError}
            setPassword={setPassword}
            setPasswordError={setPasswordError}
            emailError={emailError}
            showPassword={showPassword}
            passwordError={passwordError}
            setShowPassword={setShowPassword}
            loading={loading}
            email={email}
            password={password}
            handleSignIn={handleSignIn}
        />
    );
};

export default SignIn;
