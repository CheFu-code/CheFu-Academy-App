import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';

const Complete = () => {
    const { safeReplace } = useSafeNavigation();
    const { color, backgroundColor } = useDarkMode();
    const [countDown, setCountDown] = useState(5);

    useEffect(() => {
        if (countDown <= 0) {
            safeReplace('/(tabs)/home');
            return;
        }
        const timer = setInterval(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // cleanup
    }, [countDown, safeReplace]);

    return (
        <SafeAreaView
            style={{
                backgroundColor,
                flex: 1,
                justifyContent: 'center',
                padding: moderateScale(20),
                alignItems: 'center',
            }}
        >
            <Text
                style={{
                    color,
                    fontFamily: 'outfit-bold',
                    fontSize: RFValue(24),
                    textAlign: 'center',
                    marginBottom: 20,
                }}
            >
                Your phone number has been verified successfully.
            </Text>
            <Text style={{ color, textAlign: 'center', fontSize: RFValue(18) }}>
                You&apos;ll be redirected in {countDown} second
                {countDown !== 1 ? 's' : ''}.
            </Text>
        </SafeAreaView>
    );
};

export default Complete;
