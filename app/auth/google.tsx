import Button from "@/component/Shared/Button";
import { Ionicons } from "@expo/vector-icons";
import {
    EmailAuthProvider,
    FirebaseAuthTypes,
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
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

    function isFirebaseError(
        error: unknown
    ): error is { code: string; message: string } {
        return (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            "message" in error
        );
    }

    const signInWithGoogle = useCallback(async () => {
        try {
            setLoading(true);
            console.log("🔐 Starting Google sign-in...");

            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            const userInfo = await GoogleSignin.signIn();
            console.log("✅ Google user info:", userInfo);

            const { idToken } = await GoogleSignin.getTokens();

            const credential = GoogleAuthProvider.credential(idToken);
            const firebaseUserCredential = await signInWithCredential(
                auth,
                credential
            );

            const user = firebaseUserCredential.user;
            if (!user) {
                console.error("❌ Firebase user is null after sign-in.");
                Alert.alert(
                    "Sign-In Error",
                    "Failed to retrieve user information from Google sign-in. Please try again."
                );
                setError(
                    "Failed to retrieve user information from Google sign-in."
                );
                router.replace("/");
                return;
            }
            const name = user.displayName ?? "Google User";
            const email = user.email ?? "";

            try {
                await saveUser(user, name, email);
            } catch (saveError) {
                console.warn("⚠️ Failed to save user data:", saveError);
            }

            router.replace("/(tabs)/home");
        } catch (e: unknown) {
            if (isFirebaseError(e)) {
                Alert.alert("Sign-In Error", e.message);
                setError(e.message);
            } else {
                Alert.alert("Sign-In Error", "An unknown error occurred.");
                setError("An unknown error occurred.");
            }
            router.replace("/");
        } finally {
            setLoading(false);
        }
    }, [auth, router]);

    const linkEmailPasswordToCurrentUser = React.useCallback(
        async (
            email: string,
            password: string
        ): Promise<FirebaseAuthTypes.User> => {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("No signed-in user to link");

            if (currentUser.email && currentUser.email !== email) {
                throw new Error(
                    "Email mismatch – use the signed-in account’s email"
                );
            }

            await currentUser.reload();

            const hasPasswordProvider = currentUser.providerData?.some(
                (p) => p.providerId === EmailAuthProvider.PROVIDER_ID
            );

            if (hasPasswordProvider) {
                console.log("Password provider already linked");
                return currentUser;
            }

            try {
                const cred = EmailAuthProvider.credential(email, password);
                await currentUser.linkWithCredential(cred);
                await currentUser.reload();
                return auth.currentUser!;
            } catch (err: unknown) {
                const code = (err as { code?: string })?.code;
                if (code === "auth/provider-already-linked") return currentUser;
                if (
                    code === "auth/email-already-in-use" ||
                    code === "auth/credential-already-in-use"
                ) {
                    throw new Error(
                        "This email is already used by another account"
                    );
                }
                if (code === "auth/requires-recent-login") {
                    throw new Error("Please reauthenticate and try again");
                }
                throw err;
            }
        },
        []
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <LottieView
                    source={require("../../assets/animations/Google Logo Effect.json")}
                    autoPlay
                    loop
                    style={{ width: 140, height: 140 }}
                />
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

                <Button
                    opacity={loading ? 0.5 : 1}
                    disabled={loading}
                    loading={loading}
                    text="Try again"
                    onPress={() => router.replace("/")}
                    icon={<Ionicons name="refresh" size={20} color="#fff" />}
                />
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
