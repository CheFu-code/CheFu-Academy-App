import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { styles } from "../../styles/STEM.styles";

type ToolButtonProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
};

export default function STEM() {
    const router = useRouter();

    return (
        <>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <AntDesign name="left" size={24} color="white" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                <Ionicons
                    name="hardware-chip-outline"
                    size={64}
                    color={Colors.PRIMARY}
                />
                <Text style={styles.title}>STEM Lab</Text>
                <Text style={styles.subtitle}>
                    AI-powered learning tools for Science, Tech, Engineering,
                    and Math
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
        </>
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

