import { Colors } from "@/constant/Colors";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native"; // Added Alert for potential user feedback
import { styles } from "../../styles/GitHub.styles";
import { saveUser } from "../../utils/authService";

export default function GoogleAuthScreen() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                "441077080510-376i017sckjqhff8mf491f4erskpmp3d.apps.googleusercontent.com",
            offlineAccess: false,
        });

        signInWithGoogle();
    }, []);

    // Improved: Wrapped signInWithGoogle in useCallback to avoid unnecessary recreations
    // Added more detailed error handling and user alert for better UX
    const signInWithGoogle = useCallback(async () => {
        try {
            setLoading(true);
            console.log("🔐 Starting Google sign-in...");

            // Check Google Play Services availability for Android devices
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            // Sign in user and get Google tokens
            const userInfo = await GoogleSignin.signIn();
            console.log("✅ Google user info:", userInfo);

            const { idToken } = await GoogleSignin.getTokens();

            // Create Firebase credential and sign in
            const credential = GoogleAuthProvider.credential(idToken);
            const firebaseUserCredential = await signInWithCredential(
                auth,
                credential
            );

            const user = firebaseUserCredential.user;
            const name = user.displayName ?? "Google User";
            const email = user.email ?? "";
            console.log("📧 Firebase user:", { name, email });

            // Save user info - improved: wrapped in try/catch for safety
            try {
                await saveUser(user, name, email);
            } catch (saveError) {
                console.warn("⚠️ Failed to save user data:", saveError);
            }

            // Navigate only if user is successfully authenticated
            router.replace("/(tabs)/home");
        } catch (e: any) {
            console.error("❌ Google Sign-In failed:", e.message);

            // Added user-friendly alert dialog for error feedback
            Alert.alert(
                "Sign-In Error",
                e.message ||
                    "An unknown error occurred during sign-in. Please try again."
            );

            setError(e.message || "An unknown error occurred during sign-in.");
        } finally {
            setLoading(false);
        }
    }, [auth, router]);

    // Show loading indicator while processing sign-in
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.GREEN} />
                <Text style={styles.message}>Signing in with Google...</Text>
            </View>
        );
    }

    // Show error UI if sign-in failed
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error:</Text>
                <Text style={styles.message}>{error}</Text>
                <Text style={styles.message}>Please try again.</Text>
            </View>
        );
    }

    // Default loading UI before sign-in starts or completes
    return (
        <View style={styles.container}>
            <LottieView
                source={require("../../assets/animations/GO TO SCHOOL ANIMATION.json")}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
            />
            <Text style={styles.message}>Finishing setup...</Text>
        </View>
    );
}
