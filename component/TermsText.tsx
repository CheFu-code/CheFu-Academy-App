import { ACADEMY_PRIVACY_URL, ACADEMY_TERMS_URL } from '@/constant/links';
import { styles } from '@/styles/WelcomeScreen.styles';
import { Linking, Pressable, Text } from 'react-native';

export const TermsText = ({ disabled = false }: { disabled?: boolean }) => {
    return (
        <Pressable disabled={disabled}>
            <Text style={styles.conditions}>
                By using our app, you agree to our{' '}
                <Text
                    style={styles.conditionsLink}
                    onPress={() => Linking.openURL(ACADEMY_TERMS_URL)}
                >
                    Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                    style={styles.conditionsLink}
                    onPress={() => Linking.openURL(ACADEMY_PRIVACY_URL)}
                >
                    Privacy Policy
                </Text>
            </Text>
        </Pressable>
    );
};
