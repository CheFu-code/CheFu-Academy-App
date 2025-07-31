import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system"; // ← Add this
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  Pressable,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Chapters from "../../component/CourseView/Chapters";
import Intro from "../../component/CourseView/Intro";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function CourseView() {
  const { courseParams, enroll } = useLocalSearchParams();
  // let course = { chapters: [] };
  const router = useRouter();
  // (No navigation button found in first 80 lines, skipping UI navigation patch)
  const [course, setCourse] = useState({ chapters: [] });
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (
      typeof courseParams === "string" &&
      courseParams.trim() !== "" &&
      courseParams.trim() !== "undefined" &&
      (courseParams.trim().startsWith("{") ||
        courseParams.trim().startsWith("["))
    ) {
      try {
        const parsed = JSON.parse(courseParams);
        setCourse(parsed);
      } catch (e) {
        console.error("Failed to parse courseParams:", courseParams, e);
        setCourse({ chapters: [] });
      }
    } else {
      console.warn("courseParams is missing or invalid:", courseParams);
      setCourse({ chapters: [] });
    }
  }, [courseParams]);

  const downloadCourse = async (course) => {
    if (!course || loading) {
      ToastAndroid.show("No course data to download", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      if (userDetail?.isVerified === false) {
        ToastAndroid.show(
          "Please verify your email to download courses",
          ToastAndroid.SHORT
        );
        return;
      }

      // Check if already downloaded
      let existing = await AsyncStorage.getItem("offlineDownloads");
      let parsed = [];
      try {
        parsed = existing ? JSON.parse(existing) : [];
      } catch (e) {
        parsed = [];
      }
      if (parsed.some((d) => d.title === course.courseTitle)) {
        ToastAndroid.show("Course already downloaded", ToastAndroid.SHORT);
        setDownloaded(true);
        setLoading(false);
        return;
      }

      ToastAndroid.show("Downloading...", ToastAndroid.SHORT);
      const html = generateCourseHTML(course);
      let uri;
      try {
        ({ uri } = await Print.printToFileAsync({ html, base64: false }));
      } catch (err) {
        ToastAndroid.show("Failed to generate PDF file", ToastAndroid.SHORT);
        setLoading(false);
        return;
      }
      if (!(await Sharing.isAvailableAsync())) {
        ToastAndroid.show(
          "Sharing is not available on this device",
          ToastAndroid.SHORT
        );
        setLoading(false);
        return;
      }
      try {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Download Course PDF",
        });
      } catch (err) {
        ToastAndroid.show("Failed to share PDF", ToastAndroid.SHORT);
        setLoading(false);
        return;
      }
      const fileName = `${
        course.courseTitle?.replace(/[^a-z0-9]/gi, "_") || "course"
      }.pdf`;
      const destPath = `${FileSystem.documentDirectory}${fileName}`;
      try {
        await FileSystem.copyAsync({ from: uri, to: destPath });
      } catch (err) {
        ToastAndroid.show("Failed to save PDF locally", ToastAndroid.SHORT);
        setLoading(false);
        return;
      }
      // Save metadata to AsyncStorage, avoid duplicates
      const updated = [
        ...parsed,
        {
          id: Date.now().toString(),
          title: course.courseTitle,
          description: course.description,
          uri: destPath,
        },
      ];
      try {
        await AsyncStorage.setItem("offlineDownloads", JSON.stringify(updated));
      } catch (err) {
        ToastAndroid.show("Failed to save download info", ToastAndroid.SHORT);
        setLoading(false);
        return;
      }
      ToastAndroid.show("Downloaded", ToastAndroid.SHORT);
      setDownloaded(true);
      router.push("/download");
    } catch (err) {
      ToastAndroid.show("Unexpected error during download", ToastAndroid.SHORT);
      // Optionally log error to Sentry or console
      if (typeof console !== "undefined") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (downloaded) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1); // reset if not downloaded
    }
  }, [downloaded]);

  useEffect(() => {
    const checkDownloadStatus = async () => {
      const existing = await AsyncStorage.getItem("offlineDownloads");
      const parsed = existing ? JSON.parse(existing) : [];
      const isDownloaded = parsed.some((d) => d.title === course.courseTitle);
      setDownloaded(isDownloaded);
    };

    if (course?.courseTitle) checkDownloadStatus();
  }, [course]);

  const generateCourseHTML = (course) => {
    const {
      courseTitle,
      description,
      category,
      flashcards,
      chapters,
      qa,
      quiz,
    } = course;

    const flashcardHtml = flashcards
      .map((card) => `<p><strong>${card.front}:</strong> ${card.back}</p>`)
      .join("");

    const chapterHtml = chapters
      .map(
        (ch) => `
      <h3>${ch.chapterName}</h3>
      ${ch.content
        .map(
          (c) => `
        <p><strong>Topic:</strong> ${c.topic}</p>
        <p><strong>Explain:</strong> ${c.explain}</p>
        <p><strong>Example:</strong> ${c.example}</p>
        <pre><code>${c.code}</code></pre>
      `
        )
        .join("")}
    `
      )
      .join("");

    const qaHtml = qa
      .map(
        (q) =>
          `<p><strong>Q:</strong> ${q.question}<br/><strong>A:</strong> ${q.answer}</p>`
      )
      .join("");

    const quizHtml = quiz
      .map(
        (q) =>
          `<p><strong>Quiz:</strong> ${q.question}<br/><strong>Answer:</strong> ${q.correctAns}</p>`
      )
      .join("");

    return `
<html>
  <head>
    <meta charset="utf-8" />
    <title>${courseTitle} – CheFu Academy</title>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        padding: 40px 50px;
        color: #333;
        background: #fff;
        line-height: 1.7;
      }

      header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 10px;
        border-bottom: 4px solid #2d98da;
      }

      header h1 {
        font-size: 2.6rem;
        margin: 0;
        color: #2d3436;
      }

      header p {
        font-size: 1.2rem;
        color: #636e72;
        margin-top: 4px;
      }

      h2 {
        margin-top: 40px;
        font-size: 1.8rem;
        border-left: 6px solid #0984e3;
        padding-left: 12px;
        color: #2d3436;
      }

      h3 {
        margin-top: 20px;
        font-size: 1.3rem;
        color: #2d3436;
      }

      p {
        font-size: 1rem;
        margin: 6px 0;
      }

      pre {
        background: #f1f2f6;
        border-left: 5px solid #00a8ff;
        padding: 12px 16px;
        margin: 12px 0;
        overflow-x: auto;
        font-family: "Courier New", Courier, monospace;
        font-size: 0.95rem;
        border-radius: 4px;
        color: #2f3640;
      }

      strong {
        color: #2c3e50;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }

      th, td {
        border: 1px solid #ccc;
        padding: 10px;
        font-size: 1rem;
      }

      th {
        background-color: #2d98da;
        color: white;
      }

      footer {
        margin-top: 60px;
        padding-top: 20px;
        border-top: 2px solid #dcdde1;
        text-align: center;
        font-size: 0.95rem;
        color: #777;
      }

      .section {
        margin-bottom: 25px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>${courseTitle}</h1>
      <p>Presented by CheFu Academy</p>
    </header>

    <section class="section">
      <p><strong>Category:</strong> ${category}</p>
      <p>${description}</p>
    </section>

    <section class="section">
      <h2>Chapters</h2>
      ${chapterHtml}
    </section>

    <section class="section">
      <h2>Flashcards</h2>
      ${flashcardHtml}
    </section>

    <section class="section">
      <h2>Q&A</h2>
      ${qaHtml}
    </section>

    <section class="section">
      <h2>Quiz</h2>
      ${quizHtml}
    </section>

    <footer>
      &copy; ${new Date().getFullYear()} CheFu Academy. All rights reserved.
    </footer>
  </body>
</html>
`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
      {/* Fixed Image at the Top */}
      <Image
        source={imageAssets[course?.banner_image]}
        style={{
          width: "100%",
          height: 260,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          zIndex: 1,
        }}
      />

      <Pressable
        disabled={loading}
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.6)",
          borderRadius: 25,
          padding: 6,
        }}
      >
        <Ionicons size={24} color={Colors.BLACK} name="arrow-back" />
      </Pressable>

      {userDetail?.isVerified === true ? (
        <Pressable
          disabled={loading}
          onPress={() => downloadCourse(course)}
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 2,
            backgroundColor: Colors.GREEN,
            borderRadius: 25,
            padding: 6,
          }}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : downloaded ? (
            <TouchableOpacity onPress={() => router.push("/download")}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <MaterialIcons name="download-done" size={24} color="white" />
              </Animated.View>
            </TouchableOpacity>
          ) : (
            <MaterialIcons name="file-download" size={24} color="white" />
          )}
        </Pressable>
      ) : (
        <Pressable
          disabled={loading}
          onPress={() => downloadCourse(course)}
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 2,
            backgroundColor: Colors.LIGHT_RED,
            borderRadius: 25,
            padding: 6,
          }}
        >
          <MaterialCommunityIcons
            style={{
              marginTop: -1,
            }}
            size={24}
            color={Colors.RED}
            name="download-off-outline"
          />
        </Pressable>
      )}

      {/* Spacer below the image */}
      <View style={{ height: 260 }} />

      {/* Scrollable content below */}
      <FlatList
        data={[]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Intro course={course} enroll={enroll} />
            <Chapters course={course} />
          </View>
        }
      />
    </View>
  );
}
