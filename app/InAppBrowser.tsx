import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { WebView } from 'react-native-webview';

export default function InAppBrowser() {
    const webviewRef = useRef<WebView>(null);
    const { url } = useLocalSearchParams<{ url: string }>();
    const { safeBack } = useSafeNavigation();
    const { color, backgroundColor } = useDarkMode();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
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

            {/* WebView */}
            <WebView
                ref={webviewRef}
                source={{ uri: decodeURIComponent(url) }}
                onShouldStartLoadWithRequest={(request) => {
                    if (
                        request.url.startsWith('market://') ||
                        request.url.startsWith('itms-apps://')
                    ) {
                        Linking.openURL(request.url);
                        return false;
                    }
                    return true;
                }}
                style={{ flex: 1 }}
            />
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
});
