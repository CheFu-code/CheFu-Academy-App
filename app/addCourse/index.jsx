import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../component/Shared/Button";
import { generateCourse, generateTopics } from "../../config/AiModel";
import { db } from "../../config/fireConfig";
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

  const generateTopic = async () => {
    setLoading(true);
    let topicIdea = [];
    try {
      // Check for API key
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
            `Our AI did not respond with valid JSON.\nPlease try again later. If the issue persists, contact support: ${support}`
          );
        }
      }
      // console.log(topicIdea);
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
        setLoading(false);
        return;
      }
      let coursesObj;
      try {
        coursesObj = JSON.parse(aiResp);
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        Alert.alert(
          "Error",
          `Our AI did not respond with valid JSON.\nPlease try again later. If the issue persists, contact support: ${support}`
        );
        console.log("AI raw response:", aiResp);

        Sentry.captureException(e, {
          extra: { aiResponse: aiResp },
        });

        setLoading(false);
        return;
      }
      // Handle both array and object with courses property
      const coursesArray = Array.isArray(coursesObj)
        ? coursesObj
        : coursesObj.courses;

      if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
        Alert.alert("Error", "No courses found in AI response.");
        setLoading(false);
        return;
      }

      coursesArray.forEach(async (course) => {
        const docId = Date.now().toString();
        await setDoc(doc(db, "course", docId), {
          ...course,
          createdOn: new Date(),
          createdBy: userDetail?.email,
          docId: docId,
        });
      });
      router.push("/(tabs)/home");
      setLoading(false);
    } catch (e) {
      console.log("failed course", e.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 30,
        flexGrow: 1,
        backgroundColor: Colors.BG_COLOR,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            marginTop: 30,
          }}
        >
          <Pressable onPress={() => router.back()}>
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
          What course do you want to create? (Example: Learn JavaScript, Machine
          Learning, History, Business studies, etc)
        </Text>

        <TextInput
          onChangeText={(value) => setUserInput(value)}
          value={userInput}
          style={styles.textInput}
          numberOfLines={3}
          multiline={true}
          placeholder="Example: Learn Biology"
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
                    color: isTopicSelected(item) ? Colors.WHITE : Colors.GREEN,
                  }}
                >
                  {item.replace(/^"|"$/g, "")}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {selectedTopic.length > 0 && (
          <Button
            loading={loading}
            onPress={() => onGenerateCourse()}
            text="Generate Course"
            disabled={loading}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    width: "100%",
    borderRadius: 10,
    marginTop: 20,
    color: "black", // Assuming a dark text color for input
    height: 90,
    alignItems: "flex-start",
    fontSize: 16,
  },
});
