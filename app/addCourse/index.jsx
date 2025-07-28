import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
  where,
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
  StyleSheet,
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
import { handleAiError } from "../../utils/errorUtils";

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
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

    // Get today's start and end timestamps manually
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    setGeneratingTopic(true);

    try {
      const courseQuery = query(
        collection(db, "course"),
        where("createdBy", "==", userDetail?.email),
        where("createdOn", ">=", Timestamp.fromDate(startOfDay)),
        where("createdOn", "<=", Timestamp.fromDate(endOfDay))
      );
      const snapshot = await getDocs(courseQuery);
      const courseCountToday = snapshot.size;

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
        function safeJsonParse(json) {
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

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopic.find((item) => item === topic);
    if (!isAlreadyExist) {
      setSelectedTopic((prev) => [...prev, topic]);
    } else {
      const topics = selectedTopic.filter((item) => item !== topic);
      setSelectedTopic(topics);
    }
  };

  const isTopicSelected = (topic) => {
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
      ToastAndroid.show("Course created successfully!", ToastAndroid.SHORT);
    } catch (e) {
      console.log("failed course", e.message);
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
      <Modal animationType="fade" transparent={true} visible={generatingTopic}>
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
              Our AI is working to deliver personalized learning topics.
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
            <Text style={styles.modalTitle}>Let the Genius Work</Text>
            <Text style={styles.modalSubtext}>
              CheFu Inc.’s powerful AI is engineering your course —
              intelligently, efficiently, and uniquely for you.
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 30,
            paddingTop: 40, // adjust for status bar
            backgroundColor: Colors.BG_COLOR,
            zIndex: 10,
          }}
        >
          <Pressable
            onPress={() => {
              if (!loading) router.back();
            }}
          >
            <Ionicons
              style={{
                padding: 3,
                borderRadius: 10,
                backgroundColor: Colors.BG_GRAY,
              }}
              name="arrow-back"
              size={24}
              color={Colors.PRIMARY}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 24,
              color: Colors.PRIMARY,
            }}
          >
            Create new course
          </Text>
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
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 16,
                color: "#fff",
                marginTop: 5,
              }}
            >
              What do you want to learn today?
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 14,
                color: "#666",
                marginTop: 10,
              }}
            >
              What course do you want to create? (eg: Learn JavaScript, Machine
              Learning, History, Business studies, etc)
            </Text>

            <TextInput
              onChangeText={(value) => setUserInput(value)}
              value={userInput}
              style={styles.textInput}
              numberOfLines={3}
              multiline={true}
              placeholder="eg: Learn how to bake bread"
              color={Colors.GREEN}
              placeholderTextColor={Colors.GRAY}
            />

            <Button
              text={"Generate Topic"}
              type="fill"
              onPress={generateTopic}
              loading={loading}
              disabled={generatingTopic || !userInput.trim()}
              opacity={generatingTopic || !userInput.trim() ? 0.4 : 1}
            />

            <View
              style={{
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              {topics.length > 0 && (
                <Text
                  style={{
                    fontFamily: "outfit",
                    fontSize: 17,
                    color: "#fff",
                  }}
                >
                  Select all topics which you want to add in this course
                </Text>
              )}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 6,
                }}
              >
                {topics.map((item, index) => (
                  <Pressable key={index} onPress={() => onTopicSelect(item)}>
                    <Text
                      style={{
                        padding: 7,
                        borderWidth: 0.4,
                        borderColor: Colors.WHITE,
                        borderRadius: 99,
                        paddingHorizontal: 15,
                        backgroundColor: isTopicSelected(item)
                          ? Colors.PRIMARY
                          : null,
                        color: isTopicSelected(item)
                          ? Colors.WHITE
                          : Colors.GREEN,
                      }}
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
        onConfirm={() => setErrorModal({ ...errorModal, visible: false })}
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#121212",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.GREEN,
    marginTop: 15,
  },
  modalSubtext: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "outfit",
  },
  textInput: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    width: "100%",
    borderRadius: 10,
    marginTop: 20,
    color: "green", // Assuming a dark text color for input
    height: 90,
    alignItems: "flex-start",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    fontFamily: "outfit-bold",
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  subscribeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.GREEN,
    alignItems: "center",
    marginTop: 10,
  },
  subscribeText: {
    fontWeight: "bold",
    color: Colors.WHITE,
    fontSize: 16,
  },
});
