import { styles } from '@/styles/WelcomeScreen.styles';
import { Linking, Pressable, Text } from 'react-native';

export const TermsText = ({ disabled = false }: { disabled?: boolean }) => {
    return (
        <Pressable disabled={disabled}>
            <Text style={styles.conditions}>
                By using our app, you agree to our{' '}
                <Text
                    style={styles.conditionsLink}
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
                    style={styles.conditionsLink}
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
