import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
// import { styles } from '../../styles/About.styles';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/About.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function About() {
    const { safeBack } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    const [backDisabled, setBackDisabled] = useState(false);
    const COPYRIGHT = `© ${new Date().getFullYear()} CheFu Inc. All rights reserved.`;

    let content;
    try {
        content = (
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <ScrollView accessible accessibilityRole="scrollbar">
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            if (backDisabled) return;
                            setBackDisabled(true);
                            if (safeBack && typeof safeBack === 'function')
                                safeBack();
                            setTimeout(() => setBackDisabled(false), 1000);
                        }}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Go back to previous screen"
                        disabled={backDisabled}
                    >
                        <AntDesign
                            name="left"
                            size={scale(20)}
                            color={textColor}
                        />
                        <Text style={[styles.backText, { color: textColor }]}>
                            Back
                        </Text>
                    </TouchableOpacity>

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
