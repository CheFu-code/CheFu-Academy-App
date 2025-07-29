import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, GithubAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications',
};

export default function GitHubAuthScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID, // Make sure to set this in your .env file
      scopes: ['identity', 'user:email'],
      redirectUri: makeRedirectUri({
        scheme: Linking.createURL(''),
        path: 'auth/github', // This should match the path in your app.json/app.config.js
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      if (code) {
        exchangeCodeForTokenAndSignIn(code);
      } else {
        setError('No code received from GitHub.');
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      setError(`Authentication error: ${response.error?.message || 'Unknown error'}`);
      setLoading(false);
    } else if (response?.type === 'dismiss') {
      setError('Authentication dismissed by user.');
      setLoading(false);
      router.replace('/'); // Redirect to home or previous screen
    }
  }, [response]);

  useEffect(() => {
    if (request) {
      promptAsync();
    }
  }, [request]);

  const exchangeCodeForTokenAndSignIn = async (code: string) => {
    try {
      setLoading(true);
      setError(null);

      // Exchange the code for an access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET, 
          code,
          redirect_uri: makeRedirectUri({
            scheme: Linking.createURL(''),
            path: 'auth/github',
          }),
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      const githubAccessToken = tokenData.access_token;

      if (!githubAccessToken) {
        throw new Error('Failed to get GitHub access token.');
      }

      // Sign in to Firebase with GitHub credentials
      const credential = GithubAuthProvider.credential(githubAccessToken);
      await signInWithCredential(auth, credential);

      router.replace('/'); // Redirect to authenticated home screen
    } catch (e: any) {
      console.error('GitHub authentication error:', e);
      setError(`Failed to sign in with GitHub: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.message}>Signing in with GitHub...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
