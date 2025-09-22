import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";
import { Colors } from "@/constant/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InAppBrowser() {
    const { url } = useLocalSearchParams<{ url: string }>();
    const { safeBack } = useSafeNavigation();
    const webviewRef = useRef<WebView>(null);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={safeBack}>
                    <AntDesign name="left" size={24} color="white" />
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flex: 1,
                        gap: 10,
                    }}
                >
                    <TouchableOpacity onPress={safeBack}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => webviewRef.current?.reload()}
                    >
                        <Ionicons name="refresh" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* WebView */}
            <WebView
                ref={webviewRef}
                source={{ uri: decodeURIComponent(url) }}
                onShouldStartLoadWithRequest={(request) => {
                    if (
                        request.url.startsWith("market://") ||
                        request.url.startsWith("itms-apps://")
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
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: Colors.BG_COLOR,
    },
});
