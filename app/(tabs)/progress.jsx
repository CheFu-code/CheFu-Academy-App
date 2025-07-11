import { useFocusEffect } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import NoCourse from "../../component/Home/NoCourse";
import CourseProgressCard from "../../component/Shared/CourseProgressCard";
import { db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Progress({ enroll = false }) {
  const [courseList, setCourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setLoadingId(null);
    }, [])
  );

  useEffect(() => {
    if (userDetail) GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    if (!userDetail?.email) {
      setCourseList([]);
      setLoading(false);
      return;
    }

    db.collection("course")
      .where("createdBy", "==", userDetail.email)
      .orderBy("createdOn", "desc")
      .get()
      .then((querySnapshot) => {
        const courses = [];
        querySnapshot.forEach((doc) => {
          courses.push({ ...doc.data(), id: doc.id });
        });
        setCourseList(courses);
        setLoading(false);
      })
      .catch(() => {
        setCourseList([]);
        setLoading(false);
        Sentry.captureException(error);
      });
  };

  const handlePress = (item) => {
    const id = item.id || item.courseTitle || "";
    setLoadingId(id);

    // Add a small delay so loading state can show before navigation
    setTimeout(() => {
      router.push({
        pathname: "/courseView",
        params: {
          courseParams: JSON.stringify(item),
          enroll: enroll,
        },
      });
    }, 100);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
      <Image
        style={{
          position: "absolute",
          width: "100%",
          height: 500,
        }}
        source={require("../../assets/images/graph.png")}
      />

      <View
        style={{
          flex: 1,
          padding: 25,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 24,
            color: Colors.PRIMARY,
            marginBottom: 20,
            marginTop: 30,
            letterSpacing: 1,
          }}
        >
          Course Progress
        </Text>

        {courseList.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={() => GetCourseList()}
            refreshing={loading}
            data={courseList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isLoading =
                loadingId === (item.id || item.courseTitle || "");
              return (
                <CourseProgressCard
                  item={item}
                  width={"97%"}
                  loading={isLoading}
                  disabled={Boolean(loadingId)} // disables all cards during loading if you want
                  onPress={() => handlePress(item)}
                />
              );
            }}
          />
        ) : (
          !loading && <NoCourse />
        )}
      </View>
    </View>
  );
}
