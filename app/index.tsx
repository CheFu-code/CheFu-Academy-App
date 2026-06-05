import { TermsText } from '@/component/TermsText';
import { SEEN_WELCOME } from '@/constant/caches';
import { useAuth } from '@/context/AuthContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/WelcomeScreen.styles';

export default function Index() {
    const { safeReplace } = useSafeNavigation();
    const { userDetail } = useAuth();

    const [isReady, setIsReady] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkWelcome = async () => {
            try {
                const hasSeen = await AsyncStorage.getItem(SEEN_WELCOME);
                if (!isMounted) return;

                if (hasSeen === 'true') {
                    safeReplace(
                        userDetail ? '/(tabs)/home' : ('/auth/sso' as any),
                    );
                    return;
                }
            } catch {
                if (!isMounted) return;
            }

            setShowWelcome(true);
            setIsReady(true);
        };

        void checkWelcome();

        return () => {
            isMounted = false;
        };
    }, [safeReplace, userDetail]);

    const handleGetStarted = async () => {
        await AsyncStorage.setItem(SEEN_WELCOME, 'true');
        safeReplace('/auth/sso' as any);
    };

    if (!isReady || !showWelcome) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator
                    accessibilityLabel="Preparing CheFu Academy"
                    color="#ffffff"
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.hero}>
                <Image
                    accessible={false}
                    source={require('./../assets/images/landing.png')}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.panel}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>CheFu Academy</Text>
                </View>

                <Text style={styles.title}>Learn with a path that feels clear.</Text>
                <Text style={styles.subtitle}>
                    Build skills, track progress, and continue from any CheFu app
                    with one account.
                </Text>

                <View style={styles.metrics}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>1</Text>
                        <Text style={styles.metricLabel}>account</Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>24/7</Text>
                        <Text style={styles.metricLabel}>access</Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>SSO</Text>
                        <Text style={styles.metricLabel}>ready</Text>
                    </View>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Get started with CheFu Academy"
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={handleGetStarted}
                    android_ripple={{ color: 'rgba(255, 255, 255, 0.16)' }}
                    hitSlop={8}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </Pressable>

                <TermsText disabled={false} />
            </View>
        </SafeAreaView>
    );
}
