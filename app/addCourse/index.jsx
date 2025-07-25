import { Ionicons } from "@expo/vector-icons";
import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import Button from "../../component/Shared/Button";
import { generateCourse, generateTopics } from "../../config/AiModel";
import { Colors } from "../../constant/Colors";
import Prompt from "../../constant/Prompt";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const router = useRouter();
  const db = getFirestore();
  const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-8952058057579255/6615319669";

  const generateTopic = async () => {
    if (loading) return; // Prevent double submission
    if (!userInput.trim()) {
      Alert.alert("Input Required", "Please enter a course idea first.");
      return;
    }
    setLoading(true);
    let topicIdea = [];
    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        Alert.alert(
          "API Key Missing",
          "Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file and restart Expo."
        );
        return;
      }
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
        Alert.alert(
          "No Response",
          "The AI did not return any topics. Please try again later."
        );
        topicIdea = [];
      } else {
        try {
          topicIdea = JSON.parse(cleanedResponse);
        } catch (e) {
          topicIdea = [];
          console.error("Failed to parse AI response:", e);
          Alert.alert(
            "Error",
            `Our AI did not respond with supported data.\nPlease try again later. If the issue persists, contact support: ${support}`
          );
        }
      }
    } catch (error) {
      console.error("Error generating topic:", error);
      Alert.alert("Error", error.message || "Failed to generate topic.");
      topicIdea = [];
    } finally {
      setTopics(Array.isArray(topicIdea) ? topicIdea : []);
      setLoading(false);
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
      Alert.alert("No Topics Selected", "Please select at least one topic.");
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
        Alert.alert(
          "No Response",
          "Our AI did not return any course data. Please try again later."
        );
        return;
      }
      let coursesObj;
      try {
        coursesObj = JSON.parse(aiResp);
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        Alert.alert(
          "Error",
          `Our AI did not respond with supported data.\nPlease try again later. If the issue persists, contact support: ${support}`
        );
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
        Alert.alert("Error", "No courses found in AI response.");
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

      // const interstitial = InterstitialAd.createForAdRequest(
      //   INTERSTITIAL_AD_UNIT_ID,
      //   { requestNonPersonalizedAdsOnly: true }
      // );

      // const unsubscribe = interstitial.addAdEventsListener(({ type }) => {
      // if (type === AdEventType.LOADED) {
      // interstitial.show();
      // }
      // if (type === AdEventType.CLOSED || type === AdEventType.ERROR) {
      // unsubscribe();
      router.replace("/(tabs)/home");
      ToastAndroid.show("Course created successfully!", ToastAndroid.SHORT);
      // }
      // });

      // interstitial.load();
    } catch (e) {
      console.log("failed course", e.message);
      Alert.alert("Error", "Failed to generate course.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            What course do you want to create? (eg: Learn JavaScript,
            Machine Learning, History, Business studies, etc)
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
            disabled={loading || !userInput.trim()}
            opacity={loading || !userInput.trim() ? 0.4 : 1}
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
  );
}

const styles = StyleSheet.create({
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
  },
});
