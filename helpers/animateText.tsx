import { Colors } from '@/constant/Colors';
import React, { useEffect, useState } from 'react';
import { Platform, Text, Vibration } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Haptics from 'expo-haptics';

const AnimatedText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const nextIndex = index + 1;

            if (nextIndex > text.length) {
                setIsPaused(true);
                // Pause for 1.5 seconds at full text
                setTimeout(() => {
                    setDisplayedText('');
                    setIndex(0);
                    setIsPaused(false);
                }, 1500);
                return;
            }

            setDisplayedText(text.slice(0, nextIndex));
            setIndex(nextIndex);

            // Cross-platform haptics
            if (Platform.OS === 'ios') {
                Haptics.selectionAsync().catch(() => { });
            } else {
                Vibration.vibrate(30); // noticeable vibration on Android
            }
        }, 100);

        return () => clearInterval(interval);
    }, [index, isPaused, text]);

    return (
        <Text
            style={{
                fontSize: RFValue(24),
                fontFamily: 'outfit-bold',
                color: Colors.PRIMARY,
            }}
        >
            {displayedText}
        </Text>
    );
};

export default AnimatedText;
