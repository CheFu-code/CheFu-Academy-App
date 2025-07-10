import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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
import { db } from "../../../config/fireConfig";
import { Colors } from "../../../constant/Colors";
import { PracticeOption } from "../../../constant/Option";
import { UserDetailContext } from "../../../context/UserDetailContext";

export default function PracticeTypeHomeScreen() {
  const { type } = useLocalSearchParams();
  const option = PracticeOption.find((item) => item.name == type);
  const [loading, setLoading] = useState(false);
  // console.log(option);

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    try {
      const q = query(
        collection(db, "course"),
        where("createdBy", "==", userDetail?.email),
        orderBy("createdOn", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        setCourseList((prev) => [...prev, doc.data()]);
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const router = useRouter();
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
