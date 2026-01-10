import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

type VerifyOTPProps = {
    confirmation: FirebaseAuthTypes.ConfirmationResult;
    onSuccess: () => void;
};

export function VerifyOTP({ confirmation, onSuccess }: VerifyOTPProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    async function verifyNum() {
        try {
            setLoading(true);
            await confirmation.confirm(code);
            onSuccess();
        } catch {
            alert('Invalid or expired code');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <Text>Enter the 6-digit code</Text>

            <TextInput
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
            />

            <Button
                title="Verify"
                onPress={verifyNum}
                disabled={loading || code.length < 6}
            />
        </View>
    );
}
