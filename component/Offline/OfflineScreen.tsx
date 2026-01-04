import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/OfflineScreen.style';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';

export default function OfflineScreen() {
    const { backgroundColor } = useDarkMode();
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <LottieView
                source={require('../assets/animations/no internet.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
            <Text style={styles.title}>You&apos;re Offline</Text>
            <Text style={styles.subtitle}>
                Please connect to Wi-Fi or mobile data. Once a connection is
                detected, this screen will automatically disappear.
            </Text>
        </View>
    );
}
