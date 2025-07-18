import { Ionicons } from "@expo/vector-icons";
import { getApp } from "@react-native-firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import CourseListGrid from "../../../component/PracticeScreen/CourseListGrid";
import { Colors } from "../../../constant/Colors";
import { PracticeOption } from "../../../constant/Option";
import { UserDetailContext } from "../../../context/UserDetailContext";

export default function PracticeTypeHomeScreen() {
  const { type } = useLocalSearchParams();
  const option = PracticeOption.find((item) => item.name === type);
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  // (No navigation button found in first 80 lines, skipping UI navigation patch)

  const [loading, setLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    if (userDetail) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);

    try {
      const db = getFirestore(getApp());
      const q = query(
        collection(db, "course"),
        where("createdBy", "==", userDetail.email),
        orderBy("createdOn", "desc")
      );
      const querySnapshot = await getDocs(q);
      const courses = [];

      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() });
      });

      setCourseList(courses);
    } catch (e) {
      console.error("❌ Error fetching course list:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      onRefresh={() => GetCourseList()}
      refreshing={loading}
      style={{
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
      }}
      data={[]}
      ListHeaderComponent={
        <View
          style={{
            backgroundColor: Colors.BG_COLOR,
            flex: 1,
            marginBottom: 30,
          }}
        >
          <Image
            style={{
              height: 300,
              width: "100%",
              borderBottomRightRadius: 25,
              borderBottomLeftRadius: 25,
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
            }}
            source={option.image}
          />
          <View
            style={{
              position: "absolute",
              padding: 20,
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginTop: 27,
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
                fontSize: 25,
                color: Colors.PRIMARY,
              }}
            >
              {type}
            </Text>
          </View>

          {loading && (
            <ActivityIndicator
              size={"large"}
              style={{
                marginTop: 150,
              }}
              color={Colors.PRIMARY}
            />
          )}

          <CourseListGrid option={option} courseList={courseList} />
        </View>
      }
    />
  );
}
