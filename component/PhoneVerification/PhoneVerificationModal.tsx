import { auth } from '@/config/firebaseConfig';
import { signInWithPhoneNumber } from '@react-native-firebase/auth';
import { useState } from 'react';
import { Modal, View } from 'react-native';
import { VerifyOTP } from './OTP Verification';
import { PhoneNumberInput } from './PhoneNumberInput';

export function PhoneVerificationModal({
    visible,
    onComplete,
}: {
    visible: boolean;
    onComplete: () => void;
}) {
    const [confirmation, setConfirmation] = useState<any>(null);

    async function sendOTP(phone: string) {
        const result = await signInWithPhoneNumber(auth, phone);
        setConfirmation(result);
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
                <View
                    style={{
                        marginTop: 100,
                        padding: 20,
                        backgroundColor: '#fff',
                    }}
                >
                    {!confirmation ? (
                        <PhoneNumberInput onSubmit={sendOTP} />
                    ) : (
                        <VerifyOTP
                            confirmation={confirmation}
                            onSuccess={onComplete}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}
