import ChatMessage from "@/component/ChatMessage";
import { pickImage } from "@/hooks/useImagePicker";
import useVoiceRecorder from "@/hooks/useVoiceRecorder";
import { sendImageWithPrompt } from "@/lib/sendImageWithPrompt";
import { sendMessage } from "@/utils/sendMessage";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { styles } from "../../styles/AIChat.styles";

type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
};

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const API_KEY = "AIzaSyDslnFAex5WgQcEmnFw1SysNBdJbkuehzY";
    const [isGenerating, setIsGenerating] = useState(false);
    const genAI = new GoogleGenerativeAI(API_KEY);
    const [stopGeneration, setStopGeneration] = useState(false);
    const [currentTypingId, setCurrentTypingId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const onSpeechResult = (text: string) => {
        setInputText((prev) => (prev ? prev + " " + text : text));
    };
    const { isRecording, toggleRecording } = useVoiceRecorder(onSpeechResult);

    const pickImageHandler = async () => {
        setModalVisible(false);
        const imageUri = await pickImage();
        if (imageUri) setSelectedImage(imageUri);
    };

    const handleSend = async () => {
        if (selectedImage) {
            await sendImageWithPrompt(
                selectedImage,
                inputText,
                genAI,
                setMessages,
                setIsGenerating
            );
            setSelectedImage(null);
            setInputText("");
        } else {
            sendMessage({
                inputText,
                setMessages,
                setInputText,
                setIsGenerating,
                setStopGeneration,
                setCurrentTypingId,
                genAI,
            });
        }
    };

    return (
        <>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.select({
                    ios: "padding",
                    android: "height",
                })}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <AntDesign
                        style={{ marginTop: 25, marginLeft: 10 }}
                        name="left"
                        size={24}
                        color="white"
                    />
                    <Text style={styles.title}>AI Assistant</Text>
                </TouchableOpacity>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => <ChatMessage item={item} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatContainer}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={7}
                    getItemLayout={(_, index) => ({
                        length: 100,
                        offset: 100 * index,
                        index,
                    })}
                />

                {selectedImage && (
                    <View style={styles.selectedImageContainer}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.selectedImage}
                        />
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.attachFileButton}
                    >
                        <MaterialIcons
                            name="attach-file"
                            size={24}
                            color="#888"
                        />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor="#888"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />

                    <View style={styles.micContainer}>
                        {inputText.trim().length === 0 && !isGenerating && (
                            <TouchableOpacity
                                onPress={toggleRecording}
                                style={styles.mic}
                            >
                                <MaterialIcons
                                    name={isRecording ? "mic-off" : "mic-none"}
                                    size={24}
                                    color={isRecording ? "red" : "#888"}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {(inputText.trim().length > 0 || selectedImage) && (
                        <TouchableOpacity
                            disabled={
                                isGenerating ||
                                (!inputText.trim() && !selectedImage)
                            }
                            style={[
                                styles.sendButton,
                                {
                                    opacity:
                                        isGenerating ||
                                        (!inputText.trim() && !selectedImage)
                                            ? 0.4
                                            : 1,
                                },
                            ]}
                            onPress={handleSend}
                        >
                            <Text
                                style={[
                                    styles.sendButtonText,
                                    {
                                        opacity:
                                            isGenerating ||
                                            (!inputText.trim() &&
                                                !selectedImage)
                                                ? 0.4
                                                : 1,
                                    },
                                ]}
                            >
                                Send
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Modal sliding up from bottom */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.attachmentText}>
                                Select Attachment
                            </Text>

                            <TouchableOpacity
                                style={styles.attachmentButton}
                                onPress={pickImageHandler}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <Ionicons
                                        style={{ paddingLeft: 10 }}
                                        name="image-outline"
                                        size={20}
                                        color="black"
                                    />
                                    <Text style={styles.modalOption}>
                                        Image
                                    </Text>
                                </View>
                                <AntDesign
                                    style={{ paddingRight: 10 }}
                                    name="right"
                                    size={20}
                                    color="black"
                                />
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                style={styles.attachmentButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    ToastAndroid.show(
                                        "Not yet implemented",
                                        ToastAndroid.SHORT
                                    );
                                }}
                            >
                                <Text style={styles.modalOption}>File</Text>
                                <AntDesign
                                    style={{ paddingRight: 10 }}
                                    name="right"
                                    size={20}
                                    color="black"
                                />
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.modalCloseButton}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}
