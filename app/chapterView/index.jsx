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
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";
import * as Progress from "react-native-progress";
import Button from "../../component/Shared/Button";
import { db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";

const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-8952058057579255/6615319669";

export default function ChapterView() {
  const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
  let chapters = { content: [] };
  const [showFull, setShowFull] = useState(false); // ✅ Move this above
  const maxLines = showFull ? undefined : 5; // ✅ Use it here after defining `showFull`

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
    if (loader) return; // prevent double trigger
    setLoader(true);

    try {
      const courseRef = doc(db, "course", docId);
      await updateDoc(courseRef, {
        completedChapter: arrayUnion(chapterIndex),
      });

      const courseSnap = await getDoc(courseRef);
      const courseObject = courseSnap.exists()
        ? courseSnap.data()
        : { chapters: [] };

      ToastAndroid.show("Chapter completed!", ToastAndroid.SHORT);

      const interstitial = InterstitialAd.createForAdRequest(
        INTERSTITIAL_AD_UNIT_ID,
        { requestNonPersonalizedAdsOnly: true }
      );

      const unsubscribe = interstitial.addAdEventsListener(({ type }) => {
        if (type === AdEventType.LOADED) {
          interstitial.show();
        }
        if (type === AdEventType.CLOSED || type === AdEventType.ERROR) {
          unsubscribe();
          router.replace({
            pathname: "/courseView",
            params: {
              courseParams: JSON.stringify(courseObject),
            },
          });
          setLoader(false);
        }
      });

      interstitial.load();
    } catch (error) {
      console.error("Error completing chapter:", error);
      setLoader(false);
    }
  };

  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleCopy = async (text) => {
    setCopying(true);
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setCopying(false);
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

        <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap" }}>
          {chapters?.content[currentPage]?.explain
            ?.split(/(`[^`]+`)/g) // Step 1: Split by inline code
            .map((part, index) => {
              const isCode = part.startsWith("`") && part.endsWith("`");
              const content = isCode ? part.slice(1, -1) : part;

              // Step 2: If not code, further split by quotes
              if (!isCode) {
                return content
                  .split(/(["'][^"']+["'])/g)
                  .map((subPart, subIndex) => {
                    const isQuoted =
                      subPart.startsWith('"') && subPart.endsWith('"');

                    const text = isQuoted ? subPart.slice(1, -1) : subPart;

                    return (
                      <Text
                        numberOfLines={maxLines}
                        key={`${index}-${subIndex}`}
                        selectable
                        style={{
                          fontFamily: isQuoted ? "outfit-bold" : "outfit",
                          fontSize: 16,
                          color: "#fff",
                        }}
                      >
                        {text}
                      </Text>
                    );
                  });
              }

              // If it's inline code
              return (
                <Text
                  key={index}
                  selectable
                  style={{
                    fontFamily: "monospace",
                    fontSize: 16,
                    color: Colors.YELLOW,
                    backgroundColor: "#333",
                    borderRadius: 5,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                  }}
                >
                  {content}
                </Text>
              );
            })}

          {chapters?.content[currentPage]?.explain?.length > 200 && (
            <TouchableOpacity onPress={() => setShowFull(!showFull)}>
              <Text
                style={{
                  color: showFull ? Colors.YELLOW : Colors.GREEN,
                  marginTop: 5,
                }}
              >
                {showFull ? "Read less ▲" : "Read more ▼"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

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
          <View
            style={{
              ...styles.codeExampleText,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {chapters?.content[currentPage]?.example
              ?.split(/(`[^`]+`)/g)
              .map((part, index) => {
                const isCode = part.startsWith("`") && part.endsWith("`");
                const content = isCode ? part.slice(1, -1) : part;

                return (
                  <Text
                    key={index}
                    selectable
                    style={{
                      fontFamily: isCode ? "monospace" : "outfit",
                      fontSize: 14,
                      color: Colors.WHITE,
                      backgroundColor: isCode ? "#333" : "transparent",
                      paddingHorizontal: isCode ? 4 : 0,
                      paddingVertical: isCode ? 2 : 0,
                      borderRadius: isCode ? 5 : 0,
                      marginTop: isCode ? 1.5 : 0,
                    }}
                  >
                    {content}
                  </Text>
                );
              })}
          </View>
        )}
      </ScrollView>

      <View style={{ marginBottom: 39 }}>
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
