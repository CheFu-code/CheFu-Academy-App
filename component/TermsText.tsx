// components/TermsText.tsx
import { styles } from '@/styles/WelcomeScreen.styles';
import { Linking, Pressable, Text } from 'react-native';
import { Colors } from '../constant/Colors';

export const TermsText = ({ disabled = false }: { disabled?: boolean }) => {
    return (
        <Pressable disabled={disabled}>
            <Text style={styles.conditions}>
                By using our app, you agree to our{' '}
                <Text
                    style={{
                        color: Colors.YELLOW,
                        textDecorationLine: 'underline',
                    }}
                    onPress={() =>
                        Linking.openURL(
                            `${process.env.EXPO_PUBLIC_BASE_URL}/terms-service`,
                        )
                    }
                >
                    Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                    style={{
                        color: Colors.YELLOW,
                        textDecorationLine: 'underline',
                    }}
                    onPress={() =>
                        Linking.openURL(
                            `${process.env.EXPO_PUBLIC_BASE_URL}/privacy-policy`,
                        )
                    }
                >
                    Privacy Policy
                </Text>
            </Text>
        </Pressable>
    );
};
