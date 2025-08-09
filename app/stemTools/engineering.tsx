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

export default function Engineering() {
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
                <Text style={styles.title}>Engineering Tools</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>
                Explore AI-powered simulations and interactive tools for
                engineering concepts.
            </Text>

            <View style={styles.toolsContainer}>
                <ToolButton
                    icon="construct-outline"
                    label="Circuit Simulator"
                />
                <ToolButton icon="hammer-outline" label="Mechanics Lab" />
                <ToolButton icon="analytics-outline" label="Data Analysis" />
                <ToolButton icon="settings-outline" label="System Design" />
            </View>
        </ScrollView>
    );
}

function ToolButton({
    icon,
    label,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
}) {
    return (
        <TouchableOpacity style={styles.button}>
            <Ionicons name={icon} size={24} color="#fff" />
            <Text style={styles.buttonText}>{label}</Text>
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
    button: {
        flexDirection: "row",
        backgroundColor: "#4B7BE5",
        padding: 14,
        borderRadius: 12,
        marginVertical: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        color: "#fff",
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "600",
    },
});
