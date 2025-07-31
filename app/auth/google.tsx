import { Colors } from "@/constant/Colors";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { styles } from "../../styles/GitHub.styles";
import { saveUser } from "../../utils/authService";

export default function GoogleAuthScreen() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "441077080510-376i017sckjqhff8mf491f4erskpmp3d.apps.googleusercontent.com",
            offlineAccess: false,
        });

        signInWithGoogle();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            console.log("🔐 Starting Google sign-in...");
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();

            console.log("✅ Google user info:", userInfo);
            const { idToken } = await GoogleSignin.getTokens();

            const credential = GoogleAuthProvider.credential(idToken);
            const firebaseUserCredential = await signInWithCredential(auth, credential);

            const user = firebaseUserCredential.user;
            const name = user.displayName ?? "Google User";
            const email = user.email ?? "";

            console.log("📧 Firebase user:", { name, email });
            await saveUser(user, name, email);

            router.replace("/(tabs)/home");
        } catch (e: any) {
            console.error("❌ Google Sign-In failed:", e.message);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.GREEN} />
                <Text style={styles.message}>Signing in with Google...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error:</Text>
                <Text style={styles.message}>{error}</Text>
                <Text style={styles.message}>Please try again.</Text>
            </View>
        );
    }

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
