// components/Shared/Loading.tsx
import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constant/Colors';

interface LoadingProps {
    message?: string;
    animationSource?: any;
    size?: number;
}

export default function Loading({
    message = 'Loading...',
    animationSource,
    size = 150,
}: LoadingProps) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.BG_COLOR,
            }}
        >
            <LottieView
                autoPlay
                loop
                source={
                    animationSource ??
                    require('../../assets/animations/Loading.json')
                }
                style={{ width: size, height: size }}
            />
            <Text
                style={{
                    marginTop: 10,
                    fontFamily: 'outfit',
                    fontSize: 16,
                    color: Colors.PRIMARY,
                }}
            >
                {message}
            </Text>
        </View>
    );
}
