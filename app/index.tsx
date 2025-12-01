import { TermsText } from '@/component/TermsText';
import { useImmersiveMode } from '@/hooks/useImmersiveMode';
import { useLoadUser } from '@/hooks/useLoadUser';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useSocialAuthNavigation } from '@/hooks/useSocialAuthNavigation';
import { AntDesign } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constant/Colors';
import { styles } from '../styles/WelcomeScreen.styles';
import { scale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Index() {
    const { safePush } = useSafeNavigation();
    const { loading } = useLoadUser();
    const { navigateGoogle } = useSocialAuthNavigation();
    useImmersiveMode();

    return (
        <SafeAreaView style={styles.centeredContainer}>
            <Image
                source={require('./../assets/images/landing.png')}
                style={{ width: '100%', height: scale(400),  }}
                resizeMode="contain"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.bottomSheet}
                contentContainerStyle={{ flexGrow: 1 }}
            >
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

                <Text style={styles.subtitle}>Smart Learning Starts Here</Text>

                <TouchableOpacity
                    disabled={loading}
                    style={styles.button}
                    onPress={() => safePush('/auth/signUp')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconsContainer}
                    onPress={navigateGoogle}
                >
                    <AntDesign name="google" size={scale(28)} color="#fff" />
                    <Text
                        style={{
                            fontSize: RFValue(15),
                            fontFamily: 'outfit',
                            color: 'white',
                        }}
                    >
                        Google
                    </Text>
                </TouchableOpacity>

                <TermsText disabled={loading} />
            </ScrollView>
        </SafeAreaView>
    );
}
