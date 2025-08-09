import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display";

export default function Code() {
    const [code, setCode] = useState("");
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);
    const MAX_LENGTH = 50000;
    const API_KEY = "AIzaSyDslnFAex5WgQcEmnFw1SysNBdJbkuehzY";
    const router = useRouter();
    const genAI = new GoogleGenerativeAI(API_KEY);

    const handleExplain = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setExplanation("");

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
            });

            const prompt = `Explain the code step-by-step. Limit output to <=100 words and at most 30 numbered steps. No preamble or extra commentary:\n${code}`;

            const response = await model.generateContent(prompt);

            const text = response.response.text();
            setExplanation(text);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
            setExplanation(
                "Error: Unable to explain the code. Please try again later."
            );
        }
    };

    return (
        <>
            <View style={{padding:20}}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
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
            </View>

            <ScrollView contentContainerStyle={styles.container}>
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

                <TouchableOpacity
                    disabled={loading}
                    style={[styles.button, { opacity: loading ? 0.4 : 1 }]}
                    onPress={handleExplain}
                >
                    {!loading && (
                        <Ionicons name="bulb-outline" size={20} color="#fff" />
                    )}
                    {loading ? (
                        <ActivityIndicator size={"small"} color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Explain Code</Text>
                    )}
                </TouchableOpacity>

                {explanation ? (
                    <View style={styles.output}>
                        <Text style={styles.outputTitle}>Explanation:</Text>
                        {/* <Text style={styles.outputText}> */}
                        <Markdown
                            style={{
                                body: {
                                    color: "#EDEDED",
                                    fontSize: 16,
                                    lineHeight: 24,
                                    fontFamily: "outfit",
                                },
                                text: {
                                    color: "#EDEDED",
                                    fontSize: 16,
                                    fontFamily: "outfit",
                                },
                                strong: {
                                    fontWeight: "bold",
                                    color: "#ffffff",
                                },
                                em: {
                                    fontStyle: "italic",
                                    color: "#cccccc",
                                },
                                heading1: {
                                    fontSize: 22,
                                    fontWeight: "bold",
                                    color: "#ffffff",
                                },
                                heading2: {
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "#dddddd",
                                },
                                heading3: {
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: "#bbbbbb",
                                },
                                link: {
                                    color: "#61dafb",
                                    textDecorationLine: "underline",
                                },
                                code_inline: {
                                    backgroundColor: "#cccccc2c",
                                    color: "black",
                                    fontFamily: "outfit-bold",
                                    borderRadius: 20,
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    marginVertical: 2,
                                },
                                fence: {
                                    backgroundColor: "#1E1E1E",
                                    borderRadius: 6,
                                    padding: 10,
                                },
                                code_block: {
                                    backgroundColor: "#1E1E1E",
                                    borderRadius: 6,
                                    padding: 10,
                                    color: "#E5E5E5",
                                    fontFamily: "Courier",
                                },
                                blockquote: {
                                    backgroundColor: "#333",
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    borderLeftWidth: 4,
                                    borderLeftColor: "#888",
                                },
                                list_item: {
                                    color: "#EDEDED",
                                    fontSize: 16,
                                },
                            }}
                        >
                            {explanation}
                        </Markdown>
                        {/* </Text> */}
                    </View>
                ) : null}
            </ScrollView>
        </>
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
        marginBottom: 20,
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
