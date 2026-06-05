import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { WebView } from 'react-native-webview';

const isAllowedWebUrl = (value?: string | string[]) => {
    const raw = Array.isArray(value) ? value[0] : value;
    if (!raw) return null;

    try {
        const parsed = new URL(decodeURIComponent(raw));
        const host = parsed.hostname.toLowerCase();
        const isCheFuHost =
            host === 'chefuinc.com' || host.endsWith('.chefuinc.com');

        if (parsed.protocol !== 'https:' || !isCheFuHost) return null;

        return parsed.toString();
    } catch {
        return null;
    }
};

export default function InAppBrowser() {
    const webviewRef = useRef<WebView>(null);
    const { url } = useLocalSearchParams<{ url: string | string[] }>();
    const { safeBack } = useSafeNavigation();
    const { color, backgroundColor } = useDarkMode();
    const safeUrl = isAllowedWebUrl(url);

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { backgroundColor }]}>
                <TouchableOpacity onPress={safeBack}>
                    <AntDesign name="left" size={scale(24)} color={color} />
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flex: 1,
                        gap: scale(10),
                    }}
                >
                    <TouchableOpacity onPress={safeBack}>
                        <Ionicons name="close" size={24} color={color} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => webviewRef.current?.reload()}
                    >
                        <Ionicons
                            name="refresh"
                            size={scale(24)}
                            color={color}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {safeUrl ? (
                <WebView
                    ref={webviewRef}
                    originWhitelist={['https://*']}
                    source={{ uri: safeUrl }}
                    onShouldStartLoadWithRequest={(request) => {
                        if (
                            request.url.startsWith('market://') ||
                            request.url.startsWith('itms-apps://')
                        ) {
                            Linking.openURL(request.url);
                            return false;
                        }

                        return Boolean(isAllowedWebUrl(request.url));
                    }}
                    style={{ flex: 1 }}
                />
            ) : (
                <View style={styles.blockedContainer}>
                    <Text style={[styles.blockedTitle, { color }]}>
                        This link cannot be opened in the app.
                    </Text>
                    <Text style={styles.blockedText}>
                        For your safety, CheFu Academy only opens trusted CheFu
                        links here.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(10),
    },
    blockedContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: scale(18),
    },
    blockedTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 18,
        textAlign: 'center',
    },
    blockedText: {
        color: '#6b7280',
        fontFamily: 'outfit',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8,
        textAlign: 'center',
    },
});
