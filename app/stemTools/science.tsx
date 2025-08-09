import { Colors } from "@/constant/Colors";
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

type ScienceRoute =
    | "periodic-table"
    | "virtual-lab"
    | "physics-visualizer"
    | "biology-explorer";

export default function Science() {
    const router = useRouter();

    const handleToolPress = (screenName: ScienceRoute) => {
        router.push(`/science/${screenName}`);
    };

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
                <ToolCard
                    icon="flask-outline"
                    label="Periodic Table"
                    onPress={() => handleToolPress("periodic-table")}
                />
                <ToolCard
                    icon="planet-outline"
                    label="Virtual Lab"
                    onPress={() => handleToolPress("virtual-lab")}
                />
                <ToolCard
                    icon="magnet-outline"
                    label="Physics Visualizer"
                    onPress={() => handleToolPress("physics-visualizer")}
                />
                <ToolCard
                    icon="leaf-outline"
                    label="Biology Explorer"
                    onPress={() => handleToolPress("biology-explorer")}
                />
            </View>
        </ScrollView>
    );
}

function ToolCard({
    icon,
    label,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
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
        marginVertical: 12,
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
