import HeaderText from '@/component/common/Header';
import { LAST_UPDATED, support } from '@/constant/random';
import useDarkMode from '@/hooks/useDarkMode';
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, ScrollView, StyleSheet, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';

export default function TermsOfService() {
    const scrollRef = useRef(null);
    const { backgroundColor } = useDarkMode();

    useEffect(() => {
        // Scroll to top on mount for better UX
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: 0, animated: false });
        }
        // Announce screen for accessibility
        AccessibilityInfo.announceForAccessibility(
            'Terms of Service screen loaded',
        );
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Back Button */}
            <HeaderText title="Back" />
            <ScrollView
                ref={scrollRef}
                style={[styles.container2, { backgroundColor }]}
                showsVerticalScrollIndicator={false}
                accessibilityRole="scrollbar"
                accessibilityLabel="Terms of Service content"
            >
                <Text style={styles.title} accessibilityRole="header">
                    Terms of Service
                </Text>

                <Text style={styles.paragraph}>
                    By using this app, you agree to the following terms and
                    conditions. Please read them carefully.
                </Text>

                <Text style={styles.subtitle} accessibilityRole="header">
                    1. Use of the App
                </Text>
                <Text style={styles.paragraph}>
                    You agree to use the app only for lawful purposes and in a
                    way that does not infringe the rights of others.
                </Text>

                <Text style={styles.subtitle} accessibilityRole="header">
                    2. Accounts
                </Text>
                <Text style={styles.paragraph}>
                    You are responsible for maintaining the confidentiality of
                    your account information and for all activities that occur
                    under your account.
                </Text>

                <Text style={styles.subtitle} accessibilityRole="header">
                    3. Termination
                </Text>
                <Text style={styles.paragraph}>
                    We reserve the right to suspend or terminate your access if
                    you violate these terms or misuse the app.
                </Text>

                <Text style={styles.subtitle} accessibilityRole="header">
                    4. Changes to Terms
                </Text>
                <Text style={styles.paragraph}>
                    We may update these terms at any time. Continued use of the
                    app after changes means you accept the new terms.
                </Text>

                <Text style={styles.subtitle} accessibilityRole="header">
                    5. Contact Us
                </Text>
                <Text style={styles.paragraph}>
                    For questions or concerns about these terms, contact us at:{' '}
                    <Text
                        style={{
                            color: Colors.PRIMARY,
                            textDecorationLine: 'underline',
                        }}
                        accessibilityRole="link"
                        accessibilityLabel={`Email ${support}`}
                    >
                        {support}
                    </Text>
                </Text>

                <Text style={styles.footer}>
                    Last updated:{' '}
                    {LAST_UPDATED.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: moderateScale(20),
        flex: 1,
    },
    container2: {
        flex: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 20,
    },
    backText: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontFamily: 'outfit',
        marginLeft: 5,
    },
    title: {
        fontSize: RFValue(22),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginTop: 20,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: RFValue(16),
        fontFamily: 'outfit',
        color: Colors.GRAY,
        lineHeight: 24,
        marginBottom: 10,
    },
    footer: {
        marginTop: 30,
        fontSize: 14,
        color: Colors.GRAY,
        fontFamily: 'outfit',
        textAlign: 'center',
    },
});
