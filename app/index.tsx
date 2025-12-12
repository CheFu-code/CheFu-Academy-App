import { TermsText } from '@/component/TermsText';
import { useImmersiveMode } from '@/hooks/useImmersiveMode';
import { useLoadUser } from '@/hooks/useLoadUser';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { Colors } from '../constant/Colors';
import { styles } from '../styles/WelcomeScreen.styles';

export default function Index() {
    const { safePush } = useSafeNavigation();
    const { loading } = useLoadUser();
    useImmersiveMode();

    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const checkWelcome = async () => {
            const hasSeen = await AsyncStorage.getItem('hasSeenWelcome');
            if (!hasSeen) {
                setShowWelcome(true);
            }
        };
        checkWelcome();
    }, []);

    const handleGetStarted = async () => {
        await AsyncStorage.setItem('hasSeenWelcome', 'true');
        safePush('/auth/signUp');
    };

    if (!showWelcome) return null; // don't render until check is done

    return (
        <SafeAreaView style={styles.centeredContainer}>
            {/* Hero Image */}
            <Image
                source={require('./../assets/images/landing.png')}
                style={{ width: '100%', height: scale(400) }}
                resizeMode="contain"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.bottomSheet}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Title */}
                <Text style={styles.title}>
                    Welcome to{'\n'}
                    <Text
                        style={{
                            color: Colors.BG_COLOR,
                            fontFamily: 'outfit-bold',
                        }}
                    >
                        CheFu Academy
                    </Text>
                </Text>

                {/* Subtitle + Motivational Quote */}
                <Text style={styles.subtitle}>Smart Learning Starts Here</Text>

                {/* Get Started Button */}
                <TouchableOpacity
                    disabled={loading}
                    style={styles.button}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                {/* Footer Icons */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        <Entypo
                            name="open-book"
                            size={scale(14)}
                            color={Colors.WHITE}
                        />{' '}
                        Learn{' '}
                        <Entypo
                            name="dot-single"
                            color={'black'}
                            size={scale(14)}
                        />
                        <Entypo name="star" color={'gold'} size={scale(14)} />{' '}
                        Grow{' '}
                        <Entypo
                            name="dot-single"
                            color={'black'}
                            size={scale(14)}
                        />
                        <FontAwesome
                            name="trophy"
                            color={Colors.GREEN}
                            size={scale(14)}
                        />{' '}
                        Achieve
                    </Text>
                </View>

                <TermsText disabled={loading} />
            </ScrollView>
        </SafeAreaView>
    );
}
