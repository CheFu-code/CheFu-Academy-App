import { Colors } from "@/constant/Colors";
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

type ToolButtonProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
};

export default function STEM() {
    const router = useRouter();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <Ionicons
                style={{ marginTop: 25 }}
                name="hardware-chip-outline"
                size={64}
                color={Colors.PRIMARY}
            />
            <Text style={styles.title}>STEM Lab</Text>
            <Text style={styles.subtitle}>
                AI-powered learning tools for Science, Tech, Engineering, and
                Math
            </Text>

            <View style={styles.toolsContainer}>
                <ToolButton
                    icon="calculator-outline"
                    label="Math Solver"
                    onPress={() => router.push("/stemTools/math")}
                />
                <ToolButton
                    icon="flask-outline"
                    label="Science Sim"
                    onPress={() => router.push("/stemTools/science")}
                />
                <ToolButton
                    icon="construct-outline"
                    label="Engineering Tools"
                    onPress={() => router.push("/stemTools/engineering")}
                />
                <ToolButton
                    icon="code-slash-outline"
                    label="Code Explainer"
                    onPress={() => router.push("/stemTools/code")}
                />
                <ToolButton
                    icon="bulb-outline"
                    label="Ask AI Anything"
                    onPress={() => router.push("/stemTools/AI")}
                />
            </View>
        </ScrollView>
    );
}

function ToolButton({ icon, label, onPress }: ToolButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name={icon} size={24} color="#fff" />
            <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: Colors.BG_COLOR,
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 10,
        color: Colors.WHITE,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: Colors.GRAY,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    toolsContainer: {
        marginTop: 20,
        width: "100%",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.PRIMARY,
        padding: 14,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
});
