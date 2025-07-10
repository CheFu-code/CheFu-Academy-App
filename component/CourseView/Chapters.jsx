import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Chapters({ course }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const isChapterCompleted = (index) => {
    if (!Array.isArray(course?.completedChapter)) return false;
    // Compare as strings
    const isCompleted = course.completedChapter.find(
      (item) => item === index.toString()
    );
    return isCompleted ? true : false;
  };
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
          color: Colors.WHITE,
        }}
      >
        Chapters
      </Text>

      <FlatList
        style={{ marginBottom: 40 }}
        data={course?.chapters || []}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const completed = isChapterCompleted(index);
          return (
            <TouchableOpacity
              onPress={() => {
                if (completed && userDetail.member === false) {
                  ToastAndroid.show(
                    "You completed this chapter. Subscribe to revisit it.",
                    ToastAndroid.SHORT
                  );
                } else {
                  router.push({
                    pathname: "/chapterView",
                    params: {
                      chapterParams: JSON.stringify(item),
                      docId: course?.docId,
                      chapterIndex: index,
                    },
                  });
                }
              }}
              key={index}
              style={{
                marginVertical: 8,
                padding: 15,
                backgroundColor: "#f0f0f0",
                borderRadius: 10,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: completed ? Colors.GREEN : "#ccc",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: completed && userDetail.member === false ? 0.6 : 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  // backgroundColor: Colors.BG_GRAY,
                }}
              >
                <Text
                  style={[
                    styles.chapterText,
                    completed && { color: Colors.GREEN }, // ✨ dim completed items
                  ]}
                >
                  {index + 1}.
                </Text>
                <Text
                  style={[
                    styles.chapterText,
                    { maxWidth: 210 },
                    completed && { color: Colors.GREEN },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item?.chapterName}
                </Text>
              </View>
              {completed ? (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              ) : (
                <Ionicons name="play" color={Colors.PRIMARY} size={24} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chapterText: {
    fontFamily: "outfit",
    fontSize: 16,
  },
});
