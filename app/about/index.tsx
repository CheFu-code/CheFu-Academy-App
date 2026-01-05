import { ScrollView, Text } from 'react-native';
// import { styles } from '../../styles/About.styles';
import HeaderText from '@/component/common/Header';
import { COPYRIGHT } from '@/constant/random';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/About.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function About() {
    const { backgroundColor } = useDarkMode();

    let content;
    try {
        content = (
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <ScrollView accessible accessibilityRole="scrollbar">
                    {/* Back Button */}
                    <HeaderText title="Back" />

                    <Text style={styles.title} accessibilityRole="header">
                        About the App
                    </Text>

                    <Text style={styles.paragraph}>
                        This app was created to help users learn, manage, and
                        track their course progress in an intuitive and engaging
                        way.
                    </Text>

                    <Text style={styles.subtitle} accessibilityRole="header">
                        Features
                    </Text>
                    <Text style={styles.paragraph}>
                        • Add and manage your courses
                    </Text>
                    <Text style={styles.paragraph}>
                        • Track learning progress
                    </Text>
                    <Text style={styles.paragraph}>
                        • Visual insights and statistics
                    </Text>
                    <Text style={styles.paragraph}>
                        • Clean, user-friendly design
                    </Text>

                    <Text style={styles.subtitle} accessibilityRole="header">
                        Our Mission
                    </Text>
                    <Text style={styles.paragraph}>
                        To make learning more accessible, structured, and
                        rewarding by providing tools that support users on their
                        educational journey.
                    </Text>

                    <Text style={styles.footer}>{COPYRIGHT}</Text>
                </ScrollView>
            </SafeAreaView>
        );
    } catch (err) {
        content = (
            <Text
                style={{ color: 'red', margin: scale(20), textAlign: 'center' }}
            >
                Failed to load About screen.
            </Text>
        );
    }
    return content;
}
