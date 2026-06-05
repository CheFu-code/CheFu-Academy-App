import useDarkMode from '@/hooks/useDarkMode';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface LoadingProps {
    message?: string;
    animationSource?: any;
    size?: number;
}

const { width } = Dimensions.get('window');

export default function Loading({
    message = 'Loading...',
    animationSource,
    size,
}: LoadingProps) {
    const animationSize = size ?? Math.min(width * 0.3, 200);
    const { color, backgroundColor } = useDarkMode();
    // Animated opacity for text
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        );
        pulse.start();

        return () => pulse.stop();
    }, [fadeAnim]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <View
                accessibilityRole="progressbar"
                accessibilityLabel={message}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: moderateScale(10),
                }}
            >
                <LottieView
                    autoPlay
                    loop
                    source={
                        animationSource ??
                        require('../../assets/animations/Loading.json')
                    }
                    style={{
                        width: animationSize,
                        height: animationSize,
                    }}
                />
                <Animated.Text
                    style={{
                        marginTop: verticalScale(10),
                        fontFamily: 'outfit',
                        fontSize: RFValue(15),
                        color,
                        textAlign: 'center',
                        opacity: fadeAnim,
                    }}
                >
                    {message}
                </Animated.Text>
            </View>
        </SafeAreaView>
    );
}
