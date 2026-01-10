// components/Shared/PhoneNumberInput.tsx

import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import PhoneInputLib from 'react-native-phone-number-input';

/**
 * IMPORTANT:
 * react-native-phone-number-input has broken TS JSX typings.
 * We safely wrap it once here so the rest of the app is clean.
 */
const PhoneInput = PhoneInputLib as unknown as React.FC<any>;

type PhoneNumberInputProps = {
    onSubmit: (phone: string) => void;
};

export function PhoneNumberInput({ onSubmit }: PhoneNumberInputProps) {
    const phoneInputRef = useRef<any>(null);
    const [phone, setPhone] = useState('');

    return (
        <View>
            <PhoneInput
                ref={phoneInputRef}
                defaultCode="ZA"
                layout="first"
                autoFocus
                onChangeFormattedText={setPhone}
                withShadow
                containerStyle={{ width: '100%' }}
                textContainerStyle={{ paddingVertical: 0 }}
                textInputProps={{ keyboardType: 'phone-pad' }}
            />
        </View>
    );
}
