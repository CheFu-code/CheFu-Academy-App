import { Colors } from '@/constant/Colors';
import { useAuth } from '@/context/AuthContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import * as Sentry from '@sentry/react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

export default function CheFuSsoScreen() {
    const { backgroundColor, color } = useDarkMode();
    const { login } = useAuth();
    const { safeReplace } = useSafeNavigation();
    const startedRef = useRef(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const startSso = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError('');

        try {
            await login();
            safeReplace('/(tabs)/home');
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Unable to continue with CheFu Account.';
            setError(message);
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    }, [loading, login, safeReplace]);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;
        void startSso();
    }, [startSso]);

    return (
        <SafeAreaView
            style={{
                alignItems: 'center',
                backgroundColor,
                flex: 1,
                justifyContent: 'center',
                padding: scale(24),
            }}
        >
            <View style={{ maxWidth: scale(340), width: '100%' }}>
                <Text
                    style={{
                        color,
                        fontFamily: 'outfit-bold',
                        fontSize: scale(28),
                        textAlign: 'center',
                    }}
                >
                    CheFu Account
                </Text>
                <Text
                    style={{
                        color: Colors.GRAY,
                        fontFamily: 'outfit',
                        fontSize: scale(14),
                        lineHeight: scale(22),
                        marginTop: verticalScale(10),
                        textAlign: 'center',
                    }}
                >
                    Sign in once and continue to CheFu Academy.
                </Text>

                {error ? (
                    <Text
                        style={{
                            color: Colors.RED,
                            fontFamily: 'outfit',
                            fontSize: scale(13),
                            marginTop: verticalScale(18),
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </Text>
                ) : null}

                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={loading}
                    onPress={startSso}
                    style={{
                        alignItems: 'center',
                        backgroundColor: Colors.PRIMARY,
                        borderRadius: scale(12),
                        justifyContent: 'center',
                        marginTop: verticalScale(24),
                        minHeight: verticalScale(52),
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.WHITE} />
                    ) : (
                        <Text
                            style={{
                                color: Colors.WHITE,
                                fontFamily: 'outfit-bold',
                                fontSize: scale(15),
                            }}
                        >
                            Continue with CheFu Account
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
