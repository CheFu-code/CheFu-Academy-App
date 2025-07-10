import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard"; // Add this import at the top
import { useLocalSearchParams, useRouter } from "expo-router";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"; // Assuming you have a function to update the document
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import Button from "../../component/Shared/Button";
import { db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";

export default function ChapterView() {
  const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
  let chapters = { content: [] };

  if (
    typeof chapterParams === "string" &&
    chapterParams.trim() !== "" &&
    chapterParams.trim() !== "undefined" &&
    (chapterParams.trim().startsWith("{") ||
      chapterParams.trim().startsWith("["))
  ) {
    try {
      chapters = JSON.parse(chapterParams);
    } catch (e) {
      console.error("Failed to parse chapterParams:", chapterParams, e);
      chapters = { content: [] };
    }
  } else {
    console.warn("chapterParams is missing or invalid:", chapterParams);
    chapters = { content: [] };
  }
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);
  const GetProgress = (currentPage) => {
    const percentage = currentPage / chapters?.content?.length;
    return percentage;
  };

  const onChapterComplete = async () => {
    setLoader(true);
    const courseRef = doc(db, "course", docId);
    await updateDoc(courseRef, {
      completedChapter: arrayUnion(chapterIndex),
    });
    // Fetch the latest course data
    const courseSnap = await getDoc(courseRef);
    const courseObject = courseSnap.exists()
      ? courseSnap.data()
      : { chapters: [] };
    setLoader(false);
    setCurrentPage(0); // Reset to the first page after completion
    router.replace({
      pathname: "/courseView",
      params: {
        courseParams: JSON.stringify(courseObject),
      },
    });
  };

  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleCopy = async (text) => {
    setCopying(true);
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setCopying(false);
      // Optionally, you can show a toast or alert to indicate that the text has been copied
      // For example, you can use a library like react-native-toast-message or similar
      ToastAndroid.show("Code copied to clipboard!", ToastAndroid.CENTER);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      ToastAndroid.show("Error copying code!", ToastAndroid.SHORT);
      console.error("Error copying text:", error);
      setCopying(false);
      return;
    }
  };

  return (
    <SafeAreaView
      style={{
        padding: 25,
        backgroundColor: Colors.BG_COLOR,
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
        <Pressable disabled={loader} onPress={() => router.back()}>
          <Ionicons
            style={{
              padding: 3,
              marginTop: 25,
              borderRadius: 10,
              backgroundColor: Colors.BG_GRAY,
              opacity: loader ? 0.4 : 1,
            }}
            name="arrow-back"
            size={24}
            color={Colors.PRIMARY}
          />
        </Pressable>
        <Progress.Bar
          style={{
            // backgroundColor: Colors.GREEN,
            marginTop: 25,
          }}
          progress={GetProgress(currentPage)}
          width={Dimensions.get("screen").width * 0.7}
        />
      </View>
      <ScrollView
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            color: Colors.PRIMARY,
            marginBottom: 10,
          }}
        >
          {chapters?.content[currentPage]?.topic}
        </Text>

        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 16,
            marginTop: 10,
            color: "#fff",
          }}
        >
          {chapters?.content[currentPage]?.explain}
        </Text>

        {/* {chapters?.content[currentPage]?.code && (
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.WHITE,
              marginTop: 20,
            }}
          >
            Code:
          </Text>
        )} */}

        {chapters?.content[currentPage]?.code && (
          <View style={styles.codeBlockContainer}>
            <View style={styles.codeBlockTopBar}>
              <View style={[styles.windowCircle, styles.circleRed]} />
              <View style={[styles.windowCircle, styles.circleYellow]} />
              <View style={[styles.windowCircle, styles.circleGreen]} />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 15,
              }}
            >
              <Text style={styles.codeLabel}>Code:</Text>
              <TouchableOpacity
                disabled={copying}
                onPress={() => handleCopy(chapters?.content[currentPage]?.code)}
                style={styles.copyButton}
              >
                {copying ? (
                  <ActivityIndicator size="small" color="#61dafb" />
                ) : (
                  <Text style={styles.copyButtonText}>
                    {copied ? "Copied!" : "Copy"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              style={{ maxWidth: "100%" }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text
                selectable
                style={styles.advancedCodeBlock}
                numberOfLines={100} // allow wrapping if needed
              >
                {chapters?.content[currentPage]?.code}
              </Text>
            </ScrollView>
          </View>
        )}

        {chapters?.content[currentPage]?.example && (
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.WHITE,
              marginTop: 20,
            }}
          >
            Example:
          </Text>
        )}
        {chapters?.content[currentPage]?.example && (
          <Text style={styles.codeExampleText}>
            {chapters?.content[currentPage]?.example}
          </Text>
        )}
      </ScrollView>

      <View style={{ marginBottom: 29 }}>
        {chapters?.content?.length - 1 != currentPage ? (
          <Button
            onPress={() => setCurrentPage(currentPage + 1)}
            text={"Next"}
          />
        ) : (
          <Button
            onPress={() => onChapterComplete()}
            loading={loader}
            text={"Finish"}
            disabled={loader}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  codeExampleText: {
    backgroundColor: Colors.GREEN,
    padding: 15,
    borderRadius: 10,
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.WHITE,
    marginTop: 10,
  },

  codeLabel: {
    color: "#8BE9FD",
    fontFamily: "outfit-bold",
    fontSize: 13,
    paddingLeft: 15,
    paddingTop: 10,
  },

  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 10,
    backgroundColor: "#23272F",
    borderRadius: 6,
    marginTop: 10,
  },
  copyButtonText: {
    color: "green",
    fontFamily: "outfit-bold",
    fontSize: 13,
  },
  codeBlockTopBar: {
    height: 30,
    backgroundColor: "#282c34", // dark background for top bar
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },

  windowCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 1,
  },
  circleRed: { backgroundColor: "#ff5f56" },
  circleYellow: { backgroundColor: "#ffbd2e" },
  circleGreen: { backgroundColor: "#27c93f" },

  codeBlockContainer: {
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1e1e2f", // dark bluish-gray like VS Code
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    width: "100%",
    maxWidth: "100%",
  },
  advancedCodeBlock: {
    fontFamily: "monospace",
    fontSize: 15,
    color: "#abb2bf", // soft light gray
    padding: 15,
    lineHeight: 22,
    minWidth: 200,
    backgroundColor: "transparent",
  },
});
