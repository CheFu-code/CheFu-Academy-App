import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    AccessibilityInfo,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";

const CONTACT_EMAIL = "kurisanimaluleke77@gmail.com";
const LAST_UPDATED = new Date(2025, 6, 10); // July is month 6 (0-indexed)

export default function TermsOfService() {
    const router = useRouter();
    const scrollRef = useRef(null);

    useEffect(() => {
        // Scroll to top on mount for better UX
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: 0, animated: false });
        }
        // Announce screen for accessibility
        AccessibilityInfo.announceForAccessibility(
            "Terms of Service screen loaded"
        );
    }, []);

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    if (router && typeof router.back === "function")
                        router.back();
                }}
                accessible={true}
                accessibilityLabel="Go back"
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <ScrollView
                ref={scrollRef}
                style={styles.container2}
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
                    For questions or concerns about these terms, contact us at:{" "}
                    <Text
                        style={{
                            color: Colors.PRIMARY,
                            textDecorationLine: "underline",
                        }}
                        accessibilityRole="link"
                        accessibilityLabel={`Email ${CONTACT_EMAIL}`}
                    >
                        {CONTACT_EMAIL}
                    </Text>
                </Text>

                <Text style={styles.footer}>
                    Last updated:{" "}
                    {LAST_UPDATED.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
        marginBottom: 50,
    },
    container2: {
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 20,
    },
    backText: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontFamily: "outfit",
        marginLeft: 5,
    },
    title: {
        fontSize: 24,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
        marginTop: 20,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        fontFamily: "outfit",
        color: Colors.GRAY,
        lineHeight: 24,
        marginBottom: 10,
    },
    footer: {
        marginTop: 30,
        fontSize: 14,
        color: Colors.GRAY,
        fontFamily: "outfit",
        textAlign: "center",
    },
});
