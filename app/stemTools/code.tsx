import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Code() {
    const [code, setCode] = useState("");
    const [explanation, setExplanation] = useState("");
    const MAX_LENGTH = 50000;
    const router = useRouter();

    const handleExplain = () => {
        // Replace this with actual AI call
        setExplanation(
            "This code defines a React component that displays a title and a button. When pressed, it shows an explanation."
        );
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
                <Text style={styles.title}>Code Explainer</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>
                Paste your code snippet below and let AI explain it.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Paste your code here..."
                placeholderTextColor={Colors.GRAY}
                multiline
                maxLength={MAX_LENGTH}
                value={code}
                onChangeText={setCode}
            />

            <Text
                style={[
                    styles.charCount,
                    code.length >= MAX_LENGTH && styles.charCountExceeded,
                ]}
            >
                {code.length}/{MAX_LENGTH} characters
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleExplain}>
                <Ionicons name="bulb-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Explain Code</Text>
            </TouchableOpacity>

            {explanation ? (
                <View style={styles.output}>
                    <Text style={styles.outputTitle}>Explanation:</Text>
                    <Text style={styles.outputText}>{explanation}</Text>
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.BG_COLOR,
        padding: 20,
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: Colors.WHITE,
        marginBottom: 4,
        marginTop: 25,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.GRAY,
        marginBottom: 16,
    },
    input: {
        backgroundColor: Colors.BLACK,
        color: Colors.WHITE,
        height: 180,
        padding: 12,
        borderRadius: 12,
        textAlignVertical: "top",
        fontSize: 14,
        fontFamily: "monospace",
        borderWidth: 1,
        borderColor: Colors.GRAY,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 8,
        fontSize: 16,
    },
    output: {
        backgroundColor: Colors.GREEN,
        marginTop: 20,
        padding: 16,
        borderRadius: 10,
    },
    outputTitle: {
        color: Colors.BLACK,
        fontFamily: "outfit-bold",
        fontSize: 14,
        marginBottom: 6,
    },
    outputText: {
        color: Colors.WHITE,
        fontSize: 15,
        lineHeight: 20,
    },
    charCount: {
        color: Colors.WHITE,
        fontSize: 12,
        alignSelf: "flex-end",
        marginTop: 6,
    },
    charCountExceeded: {
        color: "red",
    },
});
