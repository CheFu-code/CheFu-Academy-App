import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MathSolver() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    const handleSolve = () => {
        if (!input.trim()) return;
        // Simulate solving
        setResult(`Result for: ${input}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#0E101C", padding: 20 }}>
            {/* Header */}
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: 20,
                    fontFamily: "outfit",
                }}
            >
                🧮 Math Solver
            </Text>

            {/* Input Box */}
            <View
                style={{
                    backgroundColor: "#1C1F33",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 20,
                }}
            >
                <TextInput
                    placeholder="Enter math problem (e.g., 2x + 3 = 9)"
                    placeholderTextColor="#888"
                    style={{
                        color: "#fff",
                        fontSize: 16,
                        fontFamily: "outfit",
                    }}
                    value={input}
                    onChangeText={setInput}
                    multiline
                />
            </View>

            {/* Solve Button */}
            <TouchableOpacity
                onPress={handleSolve}
                style={{
                    backgroundColor: "#2E3565",
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 10,
                }}
            >
                <FontAwesome6 name="calculator" size={18} color="#fff" />
                <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}
                >
                    Solve
                </Text>
            </TouchableOpacity>

            {/* Result */}
            {result !== "" && (
                <ScrollView
                    style={{
                        backgroundColor: "#1A1D2E",
                        padding: 16,
                        marginTop: 20,
                        borderRadius: 10,
                        maxHeight: 300,
                    }}
                >
                    <Text
                        style={{
                            color: "#9B8E8E",
                            fontSize: 16,
                            fontFamily: "outfit",
                        }}
                    >
                        {result}
                    </Text>
                </ScrollView>
            )}
        </View>
    );
}
