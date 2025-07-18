import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function QuestionAnswer() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const qaList = course?.qa || [];
  const [selectedQuestion, setSelectedQuestion] = useState();

  const router = useRouter();

  const getQuestionAnswer = (index) => {
    if (selectedQuestion === index) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(index);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
      }}
    >
      <Image
        style={{
          height: 500,
          width: "100%",
          position: "absolute",
        }}
        source={require("../../assets/images/graph.png")}
      />
      <View
        style={{
          // position: "absolute",
          padding: 20,
          marginTop: 30,
          marginBottom: 20,
          flex: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => {
              if (router && typeof router.back === 'function') router.back();
            }}
            accessible={true}
            accessibilityLabel="Go back"
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
              fontSize: 20,
              color: Colors.PRIMARY,
            }}
          >
            Question & Answer
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 16,
            color: Colors.WHITE,
            marginTop: 10,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {course?.courseTitle}
        </Text>

        <FlatList
          contentContainerStyle={{ paddingBottom: 25 }}
          showsVerticalScrollIndicator={false}
          data={qaList}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => getQuestionAnswer(index)}
              // key={index}
              style={styles.card}
            >
              <Text
                style={{
                  fontFamily: "outfit-bold",
                  fontSize: 16,
                  color: Colors.BLACK,
                }}
              >
                {item.question}
              </Text>
              {selectedQuestion === index && (
                <View style={styles.codeBlock}>
                  <Text style={styles.codeLabel}>Answer:</Text>
                  <Text style={styles.codeText}>{item.answer}</Text>
                </View>
              )}
            </Pressable>
          )}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    elevation: 1,
  },
  codeBlock: {
    backgroundColor: "#1e1e1e", // like VS Code dark theme
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  codeLabel: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    fontSize: 14,
    marginBottom: 4,
  },
  codeText: {
    color: "#d4d4d4",
    fontFamily: "outfit", // or any monospace font you have
    fontSize: 13,
  },
});
