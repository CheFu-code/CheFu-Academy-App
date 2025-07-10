import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import { UserDetailContext } from "../../context/UserDetailContext";
import Button from "../Shared/Button";

export default function Intro({ course, enroll }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const onEnrollCourse = async () => {
    const docId = Date.now().toString();
    const data = {
      ...course,
      createdBy: userDetail?.email,
      createdOn: new Date(),
      enrolled: true,
    };
    setLoading(true);
    await setDoc(doc(db, "course", docId), data);
    router.push({
      pathname: "/courseView/",
      params: {
        courseParams: JSON.stringify(data),
        enroll: false, // Set to false after enrollment
      },
    });
    // console.log("Course enrolled successfully:", data);
    setLoading(false);
  };

  const isCourseCompleted =
    Array.isArray(course?.completedChapter) &&
    course?.completedChapter.length === course?.chapters?.length;

  const router = useRouter();
  return (
    <View
      style={
        {
          // backgroundColor: Colors.BG_COLOR,
        }
      }
    >
      <Image
        style={{
          width: "100%",
          height: 260,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}
        source={imageAssets[course?.banner_image]}
      />
      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            color: Colors.PRIMARY,
          }}
        >
          {course?.courseTitle}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Ionicons name="book-outline" size={18} color={Colors.PRIMARY} />
          <Text
            style={{
              fontFamily: "outfit",
              textDecoration: "underline",
              fontSize: 18,
              color: Colors.WHITE,
            }}
          >
            {course?.chapters?.length} Chapters
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            marginTop: 10,
            color: Colors.WHITE,
          }}
        >
          Description:
        </Text>

        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 16,
            color: Colors.GRAY,
          }}
        >
          {course?.description}
        </Text>

        {enroll === "true" ? (
          <Button
            text={"Enroll Now"}
            loading={loading}
            onPress={onEnrollCourse}
            disabled={loading}
          />
        ) : isCourseCompleted ? (
          <Button
            text="Completed"
            disabled={true}
            icon={<Ionicons name="checkmark-circle" size={20} color="green" />}
          />
        ) : null}
      </View>

      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          padding: 20,
          marginTop: 25,
        }}
      >
        <Ionicons size={24} color={Colors.BLACK} name="arrow-back" />
      </Pressable>
    </View>
  );
}
