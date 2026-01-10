// auth/verify-phone.tsx
import { PhoneVerificationModal } from '@/component/PhoneVerification/PhoneVerificationModal';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useState } from 'react';

const VerifyPhone = () => {
    const { safeReplace } = useSafeNavigation();
    const [visible, setVisible] = useState(true);

    const handleComplete = () => {
        setVisible(false);
        safeReplace('/auth/complete');
    };

    return (
        <PhoneVerificationModal visible={visible} onComplete={handleComplete} />
    );
};

export default VerifyPhone;
