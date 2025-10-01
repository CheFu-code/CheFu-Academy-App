import Button from '@/component/Shared/Button';
import { auth } from '@/config/fireConfig';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Ionicons } from '@expo/vector-icons';
import {
    GoogleAuthProvider,
    signInWithCredential,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles/GitHub.styles';
import { saveUser } from '../../utils/authService';

export default function GoogleAuthScreen() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { safeReplace } = useSafeNavigation();

    function isFirebaseError(
        error: unknown,
    ): error is { code: string; message: string } {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            'message' in error
        );
    }

    const signInWithGoogle = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            const userInfo = await GoogleSignin.signIn();

            if (!userInfo?.data?.idToken) {
                throw new Error('No ID token returned from Google Sign-In');
              }

              const { idToken } = userInfo.data;
            const credential = GoogleAuthProvider.credential(idToken);
            const firebaseUserCredential = await signInWithCredential(
                auth,
                credential,
            );
            const user = firebaseUserCredential.user;

            if (!user) {
                throw new Error(
                    'Failed to retrieve user information from Google sign-in.',
                );
            }

            const name = user.displayName ?? 'Google User';
            const email = user.email ?? '';

            const savedData = await saveUser(user, name, email);

            if (!savedData) {
                throw new Error('Failed to save user data.');
            }

            safeReplace('/(tabs)/home');
        } catch (err: unknown) {
            console.error('Google sign-in error:', err);
            const message = isFirebaseError(err)
                ? err.message
                : (err as Error)?.message ?? 'An unknown error occurred.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [safeReplace]);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '441077080510-376i017sckjqhff8mf491f4erskpmp3d.apps.googleusercontent.com',
            offlineAccess: false,
        });

        signInWithGoogle();
    }, [signInWithGoogle]);

    if (loading) {
        return (
            <View style={styles.container}>
                <LottieView
                    source={require('../../assets/animations/Google Logo Effect.json')}
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
                    onPress={() => signInWithGoogle()}
                    icon={<Ionicons name="refresh" size={20} color="#fff" />}
                />
            </View>
        );
    }

    // Default loading UI before sign-in starts or completes
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/animations/GO TO SCHOOL ANIMATION.json')}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
            />
            <Text style={styles.message}>Finishing setup...</Text>
        </View>
    );
}
