import { checkDailyLimit } from "@/utils/firestoreUtils";
import { Ionicons } from "@expo/vector-icons";
import {
    doc,
    getFirestore,
    setDoc
} from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useContext, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    View,
} from "react-native";
import AppModal from "../../component/Shared/AppModal";
import Button from "../../component/Shared/Button";
import { generateCourse, generateTopics } from "../../config/AiModel";
import { Colors } from "../../constant/Colors";
import Prompt from "../../constant/Prompt";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/AddCourse";
import { handleAiError } from "../../utils/errorUtils";

export default function AddCourse() {
    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [userInput, setUserInput] = useState("");
    const [topics, setTopics] = useState<string[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
    const [generatingTopic, setGeneratingTopic] = useState(false);
    const router = useRouter();
    const db = getFirestore();
    const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-8952058057579255/6615319669";
    const [limitModalVisible, setLimitModalVisible] = useState(false);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: "",
        message: "",
    });

    const generateTopic = async () => {
        if (generatingTopic) return; // Prevent double submission
        if (!userInput.trim()) {
            setErrorModal({
                visible: true,
                title: "Input Required",
                message: "Please enter a course idea first.",
            });
            return;
        }

        setGeneratingTopic(true);

        try {
            const courseCountToday = await checkDailyLimit(userDetail?.email);

            if (userDetail?.member === false && courseCountToday >= 3) {
                setLimitModalVisible(true);
                setGeneratingTopic(false);
                setUserInput("");
                setTopics([]);
                setSelectedTopic([]);
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error checking course count:", error);
            Alert.alert("Error", "Failed to verify daily course limit.");
            setGeneratingTopic(false);
            return;
        }

        let topicIdea = [];
        try {
            const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) {
                setErrorModal({
                    visible: true,
                    title: "Missing Key",
                    message: "Your AI key is missing.",
                });
                setGeneratingTopic(false);
                return;
            }
            setGeneratingTopic(true);
            const promptText = userInput + Prompt.IDEA;
            const contents = [
                {
                    role: "user",
                    parts: [{ text: promptText }],
                },
            ];
            const aiResponse = await generateTopics(contents);
            const cleanedResponse =
                aiResponse && typeof aiResponse === "string"
                    ? aiResponse.replace(/^```json[\r\n]+|```$/gi, "").trim()
                    : aiResponse;
            if (!cleanedResponse || cleanedResponse.trim() === "") {
                setErrorModal({
                    visible: true,
                    title: "No Response",
                    message: "The AI didn’t return any results.",
                });
                topicIdea = [];
                setGeneratingTopic(false);
                return;
            } else {
                function safeJsonParse(json: string) {
                    try {
                        return JSON.parse(json);
                    } catch {
                        return null;
                    }
                }

                try {
                    topicIdea = safeJsonParse(cleanedResponse) || [];
                } catch (e) {
                    topicIdea = [];
                    handleAiError(e, support);
                }
            }
            setUserInput("");
        } catch (error) {
            console.error("Error generating topic:", error);
            setErrorModal({
                visible: true,
                title: "Error",
                message: "Failed to generate topic.",
            });
            topicIdea = [];
        } finally {
            setTopics(Array.isArray(topicIdea) ? topicIdea : []);
            setGeneratingTopic(false);
        }
    };

    const onTopicSelect = (topic: string) => {
        const isAlreadyExist = selectedTopic.find((item) => item === topic);
        if (!isAlreadyExist) {
            setSelectedTopic((prev) => [...prev, topic]);
        } else {
            const topics = selectedTopic.filter((item) => item !== topic);
            setSelectedTopic(topics);
        }
    };

    const isTopicSelected = (topic: string) => {
        const selection = selectedTopic.find((item) => item === topic);
        return selection ? true : false;
    };

    const support = "kurisanimaluleke77@gmail.com";

    const onGenerateCourse = async () => {
        if (loading) return; // Prevent double submission
        if (!selectedTopic.length) {
            setErrorModal({
                visible: true,
                title: "No Topics Selected",
                message: "Please select at least one topic.",
            });

            return;
        }
        setLoading(true);
        const promptText = selectedTopic + Prompt.COURSE;
        const contents = [
            {
                role: "user",
                parts: [{ text: promptText }],
            },
        ];
        try {
            const aiResp = await generateCourse(contents);
            if (!aiResp || aiResp.trim() === "") {
                setErrorModal({
                    visible: true,
                    title: "No Response",
                    message: "The AI didn’t return any results.",
                });
                setLoading(false);
                return;
            }
            let coursesObj;
            try {
                coursesObj = JSON.parse(aiResp);
            } catch (e) {
                handleAiError(e, support);
                if (typeof Sentry !== "undefined") {
                    Sentry.captureException(e, {
                        extra: { aiResponse: aiResp },
                    });
                }
                return;
            }
            // Handle both array and object with courses property
            const coursesArray = Array.isArray(coursesObj)
                ? coursesObj
                : coursesObj.courses;

            if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
                setErrorModal({
                    visible: true,
                    title: "No Response",
                    message: "The AI didn’t return any results.",
                });
                setLoading(false);
                return;
            }

            // Await all course writes before continuing
            await Promise.all(
                coursesArray.map(async (course) => {
                    const emailSafe = userDetail?.email.replace(/[@.]/g, "_");
                    const docId = emailSafe + "_" + Date.now().toString();

                    await setDoc(doc(db, "course", docId), {
                        ...course,
                        createdOn: new Date(),
                        createdBy: userDetail?.email,
                        docId: docId,
                    });
                })
            );

            router.replace("/(tabs)/home");
            ToastAndroid.show(
                "Course created successfully!",
                ToastAndroid.SHORT
            );
        } catch (e: unknown) {
            console.log("failed course", (e as Error).message);
            setErrorModal({
                visible: true,
                title: "Error",
                message: "Failed to generate course.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (generatingTopic) {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={generatingTopic}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <LottieView
                            source={require("./../../assets/animations/Brainstorm.json")}
                            autoPlay
                            loop
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={styles.modalTitle}>
                            Let’s find what matters most to you.
                        </Text>
                        <Text style={styles.modalSubtext}>
                            Our AI is working to deliver personalized learning
                            topics.
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

    if (loading) {
        return (
            <Modal animationType="fade" transparent={true} visible={loading}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <LottieView
                            source={require("./../../assets/animations/generatingTopic.json")}
                            autoPlay
                            loop
                            style={{ width: 190, height: 190 }}
                        />
                        <Text style={styles.modalTitle}>
                            Let the Genius Work
                        </Text>
                        <Text style={styles.modalSubtext}>
                            CheFu Inc.’s powerful AI is engineering your course
                            — intelligently, efficiently, and uniquely for you.
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
                <View style={styles.container}>
                    <Pressable
                        onPress={() => {
                            if (!loading) router.back();
                        }}
                    >
                        <Ionicons
                            style={styles.backIcon}
                            name="arrow-back"
                            size={24}
                            color={Colors.PRIMARY}
                        />
                    </Pressable>
                    <Text style={styles.header}>Create new course</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: 30,
                        flexGrow: 1,
                        backgroundColor: Colors.BG_COLOR,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>
                            What do you want to learn today?
                        </Text>
                        <Text style={styles.subtitle}>
                            What course do you want to create? (eg: Learn
                            JavaScript)
                        </Text>

                        <TextInput
                            onChangeText={(value) => setUserInput(value)}
                            value={userInput}
                            style={styles.textInput}
                            numberOfLines={3}
                            multiline={true}
                            placeholder="eg: Learn how to bake bread"
                            placeholderTextColor={Colors.GRAY}
                        />

                        <Button
                            text={"Generate Topic"}
                            type="fill"
                            onPress={generateTopic}
                            loading={loading}
                            disabled={generatingTopic || !userInput.trim()}
                            opacity={
                                generatingTopic || !userInput.trim() ? 0.4 : 1
                            }
                            icon={
                                <Ionicons name="add" size={16} color="#fff" />
                            }
                        />

                        <View
                            style={{
                                marginTop: 15,
                                marginBottom: 15,
                            }}
                        >
                            {topics.length > 0 && (
                                <Text style={styles.selectTopic}>
                                    Select all topics which you want to add in
                                    this course
                                </Text>
                            )}
                            <View style={styles.topicsContainer}>
                                {topics.map((item, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => onTopicSelect(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.topics,
                                                {
                                                    backgroundColor:
                                                        isTopicSelected(item)
                                                            ? Colors.PRIMARY
                                                            : undefined,
                                                    color: isTopicSelected(item)
                                                        ? Colors.WHITE
                                                        : Colors.GREEN,
                                                },
                                            ]}
                                        >
                                            {item.replace(/^"|"$/g, "")}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {selectedTopic.length > 0 && (
                            <View style={{ marginBottom: 50 }}>
                                <Button
                                    loading={loading}
                                    onPress={() => onGenerateCourse()}
                                    text="Generate Course"
                                    disabled={loading}
                                    icon={null}
                                    opacity={loading ? 0.4 : 1}
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>

            <AppModal
                visible={errorModal.visible}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                showCancel={false}
                onConfirm={() =>
                    setErrorModal({ ...errorModal, visible: false })
                }
                onCancel={() =>
                    setErrorModal({ ...errorModal, visible: false })
                }
            />

            <AppModal
                visible={limitModalVisible}
                title="Daily Limit Reached"
                message="Free users can only create up to 3 courses per day. Upgrade to unlock unlimited access."
                confirmText="Upgrade"
                cancelText="Cancel"
                confirmColor={Colors.GREEN}
                onCancel={() => setLimitModalVisible(false)}
                onConfirm={() => {
                    setLimitModalVisible(false);
                    router.push("/subscription");
                }}
            />
        </>
    );
}
