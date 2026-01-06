import { Feather } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import {
    SafeAreaView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';
import Button from './Shared/Button';

type LoadingScreenProps = {
    retryAuth: () => Promise<void>;
};

const LoadingScreen = ({ retryAuth }: LoadingScreenProps) => {
    const scheme = useColorScheme();
    const color = scheme === 'dark' ? Colors.GREEN : Colors.BLACK;
    const [triggering, setTriggering] = useState<boolean>(false);

    // re-trigger the auth-system-button when user accidentally close the biometric auth UI
    const trigger = async () => {
        try {
            setTriggering(true);
            await retryAuth();
        } catch (error: unknown) {
            ToastAndroid.show('Error unlocking your app', ToastAndroid.LONG);
            console.log('Biometrics error', error);
        } finally {
            setTriggering(false);
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                    scheme === 'dark' ? Colors.BG_COLOR : Colors.WHITE,
                paddingHorizontal: scale(18),
            }}
        >
            <LottieView
                source={require('../assets/animations/Face scanning.json')}
                autoPlay
                loop
                style={{ width: scale(130), height: verticalScale(130) }}
            />
            <TouchableOpacity
                onPress={() => trigger()}
                style={{
                    backgroundColor:
                        scheme === 'dark' ? Colors.BG_COLOR : Colors.GRAY,
                    marginTop: verticalScale(10),
                    padding: scale(12),
                    borderRadius: scale(8),
                }}
            >
                <Text
                    style={{
                        fontSize: RFValue(14),
                        color,
                        fontFamily: 'outfit-bold',
                        textAlign: 'center',
                    }}
                >
                    Please wait while we unlock CheFu Academy for you...
                </Text>
                <Text
                    style={{
                        marginTop: verticalScale(8),
                        fontSize: RFValue(12),
                        color: Colors.WHITE,
                        fontFamily: 'outfit',
                        textAlign: 'center',
                    }}
                >
                    We help you learn with confidence and privacy.
                </Text>
            </TouchableOpacity>

            <Button
                type={scheme === 'dark' ? 'outline' : 'fill'}
                disabled={triggering}
                loading={triggering}
                onPress={trigger}
                text={'UNLOCK'}
                icon={
                    <Feather name="unlock" size={scale(14)} color={'white'} />
                }
            />
        </SafeAreaView>
    );
};

export default LoadingScreen;
