import Button from "@/component/Shared/Button";
import { Ionicons } from "@expo/vector-icons";
import {
    getAuth,
    GithubAuthProvider,
    signInWithCredential,
} from "@react-native-firebase/auth";
import {
    CodeChallengeMethod,
    makeRedirectUri,
    useAuthRequest,
} from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { styles } from "../../styles/GitHub.styles";
import { saveUser } from "../../utils/authService";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function GitHubAuthScreen() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { safeReplace } = useSafeNavigation()
    const auth = getAuth();

    const codeVerifierRef = useRef<string | null | undefined>(null);

    const redirectUri = makeRedirectUri({
        scheme: "chefu-academy",
        path: "auth/github",
    });

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
            scopes: ["read:user", "user:email"],
            redirectUri,
            usePKCE: true,
            codeChallengeMethod: CodeChallengeMethod.S256,
        },
        discovery
    );

    useEffect(() => {
        if (request) {
            codeVerifierRef.current = request.codeVerifier ?? null;
            promptAsync()
                .then((result) => { })
                .catch((err) => {
                    console.error("promptAsync error:", err);
                });
        }
    }, [request]);

    useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params;
            if (code && codeVerifierRef.current) {
                exchangeCodeForTokenAndSignIn(code, codeVerifierRef.current);
            } else {
                console.error("Missing code or codeVerifier.");
                setLoading(false);
                setError("Missing authorization code or code verifier.");
            }
        } else if (response?.type === "error") {
            console.error("Auth error:", response.error);
            setLoading(false);
            setError(`Auth error: ${response.error}`);
        } else if (response?.type === "dismiss") {
            setLoading(false);
            setError("Sign-in cancelled.");
        }
    }, [response]);

    const exchangeCodeForTokenAndSignIn = async (
        code: string,
        codeVerifier: string
    ) => {
        try {
            setLoading(true);
            const tokenResponse = await fetch(
                "https://github.com/login/oauth/access_token",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        client_id: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
                        client_secret:
                            process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET!,
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: redirectUri,
                    }),
                }
            );

            const tokenData = await tokenResponse.json();

            if (tokenData.error) {
                throw new Error(tokenData.error_description || tokenData.error);
            }

            const githubAccessToken = tokenData.access_token;
            if (!githubAccessToken) {
                throw new Error("No access token received.");
            }

            // Fetch user info from GitHub API to debug user data
            const userResponse = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `token ${githubAccessToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
            });
            const userData = await userResponse.json();
            console.log("GitHub User Data:", userData);

            // Firebase sign-in
            const credential = GithubAuthProvider.credential(githubAccessToken);

            const firebaseUserCredential = await signInWithCredential(
                auth,
                credential
            );
            const user = firebaseUserCredential.user;

            try {
                let name =
                    userData.name && userData.name.trim() !== ""
                        ? userData.name
                        : user.displayName ?? userData.login ?? "";

                let email = user.email ?? userData.email;

                if (!email) {
                    const emailResponse = await fetch(
                        "https://api.github.com/user/emails",
                        {
                            headers: {
                                Authorization: `token ${githubAccessToken}`,
                                Accept: "application/vnd.github.v3+json",
                            },
                        }
                    );
                    const emails = await emailResponse.json();
                    const primaryEmail = Array.isArray(emails)
                        ? emails.find((e) => e.primary && e.verified)?.email
                        : null;

                    email = primaryEmail ?? email;
                }

                const savedData = await saveUser(user, name, email);
                console.log("User data saved to Firestore:", savedData);

                if (savedData) {
                    // ✅ redirect only after user is saved
                    safeReplace("/(tabs)/home");
                } else {
                    setError("Failed to save user data.");
                }
            } catch (e: any) {
                console.error("Error saving user:", e.message);
                setError("Error saving user profile.");
            }
        } catch (e: any) {
            console.error("GitHub sign-in failed:", e.message);
            setError(`GitHub sign-in failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <LottieView
                    source={require("../../assets/animations/git logo.json")}
                    autoPlay
                    loop
                    style={{ width: 140, height: 140 }}
                />
                <Text style={styles.message}>Signing in with GitHub...</Text>
            </View>
        );
    }

    console.log("Current error state:", error);
    if (error) {
        console.error("Displayed error:", error);

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
                    onPress={() => safeReplace("/")}
                    icon={<Ionicons name="refresh" size={20} color="#fff" />}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LottieView
                source={require("./../../assets/animations/GO TO SCHOOL ANIMATION.json")}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
            />
            <Text style={styles.message}>Redirecting...</Text>
        </View>
    );
}
