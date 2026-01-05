import HeaderText from '@/component/common/Header';
import useDarkMode from '@/hooks/useDarkMode';
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';

export default function Privacy() {
    const { textColor, backgroundColor } = useDarkMode();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Back Button */}
            <HeaderText title="Back" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.container2}
            >
                <Text style={styles.title}>Privacy Policy</Text>

                <Text style={styles.paragraph}>
                    Your privacy is important to us. This Privacy Policy
                    outlines how we collect, use, and protect your information
                    when using our app.
                </Text>

                <Text style={styles.subtitle}>1. Information We Collect</Text>
                <Text style={styles.paragraph}>
                    We may collect personal details like your name, email
                    address, and usage activity to enhance your experience.
                </Text>

                <Text style={styles.subtitle}>2. How We Use Information</Text>
                <Text style={styles.paragraph}>
                    We use your data to provide course recommendations, track
                    progress, and improve the app’s performance.
                </Text>

                <Text style={styles.subtitle}>3. Data Security</Text>
                <Text style={styles.paragraph}>
                    We implement strict security measures to ensure your data is
                    safe and not shared with third parties without your consent.
                </Text>

                <Text style={styles.subtitle}>4. Your Control</Text>
                <Text style={styles.paragraph}>
                    You can request to delete your account or modify your
                    information at any time through your profile settings.
                </Text>

                <Text style={styles.subtitle}>5. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions about our privacy policy, please
                    contact us at:{' '}
                    <Pressable
                        onPress={() =>
                            Linking.openURL(
                                'mailto:kurisanimaluleke77@gmail.com',
                            )
                        }
                    >
                        <Text
                            style={{
                                color: Colors.PRIMARY,
                                textDecorationLine: 'underline',
                            }}
                        >
                            {' '}
                            chefu.inc@gmail.com
                        </Text>
                    </Pressable>
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL(
                            'https://chefu-academy.vercel.app/privacy-policy',
                        )
                    }
                >
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: RFValue(15),
                            marginTop: verticalScale(10),
                            color: textColor,
                        }}
                    >
                        ...more
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footer}>Last updated: July 10, 2025</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: verticalScale(15),
        flex: 1,
    },
    container2: {
        flex: 1,
    },
    title: {
        fontSize: RFValue(24),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginBottom: verticalScale(10),
        marginTop: verticalScale(10),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(5),
    },
    backText: {
        fontSize: RFValue(18),
        fontFamily: 'outfit-bold',
    },
    subtitle: {
        fontSize: RFValue(18),
        fontFamily: 'outfit-bold',
        color: Colors.PRIMARY,
        marginTop: verticalScale(20),
    },
    paragraph: {
        fontSize: RFValue(15),
        fontFamily: 'outfit',
        color: Colors.GRAY,
        lineHeight: scale(20),
    },
    footer: {
        marginTop: verticalScale(30),
        fontSize: RFValue(12),
        color: Colors.GRAY,
        fontFamily: 'outfit',
        textAlign: 'center',
    },
});
