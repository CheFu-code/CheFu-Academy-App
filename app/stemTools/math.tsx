import { Colors } from "@/constant/Colors";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MathSolver() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const API_KEY = "AIzaSyDslnFAex5WgQcEmnFw1SysNBdJbkuehzY";
    const genAI = new GoogleGenerativeAI(API_KEY);

    const handleSolve = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult("");

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
            });

            const prompt = `Solve the math problem step-by-step. Provide only the detailed solution steps followed by the final answer. Do not include any additional explanations or commentary:\n${input}`;

            const response = await model.generateContent(prompt);

            const text = response.response.text();
            setResult(text);
        } catch (error) {
            console.error(error);
            setResult("Error: Unable to solve the problem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#0E101C", padding: 20 }}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 25,
                    marginBottom: 20,
                }}
            >
                <AntDesign name="left" size={24} color={Colors.WHITE} />
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "600",
                        color: "#fff",
                        fontFamily: "outfit",
                    }}
                >
                    Math Solver
                </Text>
            </TouchableOpacity>

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
            {input.trim() !== "" && (
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
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    <FontAwesome6 name="calculator" size={18} color="#fff" />
                    {loading ? (
                        <ActivityIndicator size={"small"} color="#fff" />
                    ) : (
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 16,
                                fontFamily: "outfit",
                            }}
                        >
                            Solve
                        </Text>
                    )}
                </TouchableOpacity>
            )}

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
