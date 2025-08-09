import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Linking,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function Privacy() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
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
                    contact us at:{" "}
                    <Pressable
                        onPress={() =>
                            Linking.openURL(
                                "mailto:kurisanimaluleke77@gmail.com"
                            )
                        }
                    >
                        <Text
                            style={{
                                color: Colors.PRIMARY,
                                textDecorationLine: "underline",
                            }}
                        >
                            {" "}
                            kurisanimaluleke77@gmail.com
                        </Text>
                    </Pressable>
                </Text>

                <Text style={styles.footer}>Last updated: July 10, 2025</Text>
            </ScrollView>
        </SafeAreaView>
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
    title: {
        fontSize: 24,
        fontFamily: "outfit-bold",
        color: Colors.PRIMARY,
        marginBottom: 15,
        marginTop: 10,
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
    },
    footer: {
        marginTop: 30,
        fontSize: 14,
        color: Colors.GRAY,
        fontFamily: "outfit",
        textAlign: "center",
    },
});
