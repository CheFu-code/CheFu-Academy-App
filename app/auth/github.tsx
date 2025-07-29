import { Colors } from "@/constant/Colors";
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
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { saveUser } from "../../utils/authService";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function GitHubAuthScreen() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
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
            router.push("/");
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
                        client_secret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET!,
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

                // Fetch primary GitHub email if needed
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
            } catch (e: any) {
                console.error("Error saving user:", e.message);
            }

            router.replace("/");

            router.replace("/");
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
                <ActivityIndicator size="large" color={Colors.GREEN} />
                <Text style={styles.message}>Signing in with GitHub...</Text>
            </View>
        );
    }

    console.log("Current error state:", error);
    if (error) {
        console.error("Displayed error:", error);

        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {String(error)}</Text>
                <Text style={styles.message}>Please try again.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Redirecting...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
    },
    message: {
        marginTop: 20,
        fontSize: 20,
        color: Colors.PRIMARY,
        fontFamily: "outfit-bold",
    },
    errorText: {
        marginTop: 20,
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginHorizontal: 20,
    },
});
