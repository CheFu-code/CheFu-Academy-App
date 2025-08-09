import { Colors } from "@/constant/Colors"; // Customize this to match your theme
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Science() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
                <AntDesign
                    style={{ marginTop: 23 }}
                    name="left"
                    size={24}
                    color="white"
                />
                <Text style={styles.title}>Science Tools</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>
                Dive into the world of science with AI-powered visualizations
                and experiments.
            </Text>

            <View style={styles.toolsContainer}>
                <ToolCard icon="flask-outline" label="Periodic Table" />
                <ToolCard icon="planet-outline" label="Virtual Lab" />
                <ToolCard icon="magnet-outline" label="Physics Visualizer" />
                <ToolCard icon="leaf-outline" label="Biology Explorer" />
            </View>
        </ScrollView>
    );
}

function ToolCard({
    icon,
    label,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
}) {
    return (
        <TouchableOpacity style={styles.card}>
            <Ionicons name={icon} size={24} color="#fff" />
            <Text style={styles.cardText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: Colors.BG_COLOR,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.WHITE,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.GRAY,
        textAlign: "center",
        marginVertical: 12,
        paddingHorizontal: 20,
    },
    toolsContainer: {
        marginTop: 20,
        width: "100%",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#8E44AD",
        padding: 14,
        borderRadius: 12,
        marginVertical: 8,
        alignItems: "center",
    },
    cardText: {
        color: "#fff",
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "600",
    },
});
