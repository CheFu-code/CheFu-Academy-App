import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";

export default function CourseList({
  courseList,
  heading = "Courses",
  enroll = false,
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);

  const handlePress = (item) => {
    setLoadingId(item.id || item.courseTitle || "");
    router.push({
      pathname: "/courseView",
      params: {
        courseParams: JSON.stringify(item),
        enroll: enroll,
      },
    });
    setLoadingId(null); // Immediately reset loadingId after navigation call
  };

  return (
    <View
      style={{
        marginTop: 15,
        // flex: 1
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
          color: Colors.PRIMARY,
        }}
      >
        {heading}
      </Text>
      <FlatList
        data={courseList}
        keyExtractor={(item, index) =>
          item.id?.toString() || item.courseTitle || index.toString()
        }
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => {
          const isLoading = loadingId === (item.id || item.courseTitle || "");
          return (
            <TouchableOpacity
              // key={item.id || index}
              style={styles.courseContainer}
              onPress={() => handlePress(item)}
              disabled={isLoading}
            >
              <Image
                style={{
                  width: 200,
                  height: 110,
                  borderRadius: 15,
                  opacity: isLoading ? 0.5 : 1,
                }}
                source={imageAssets[item.banner_image]}
              />
              <Text
                style={{
                  fontFamily: "outfit-bold",
                  fontSize: 15,
                  marginTop: 10,
                  numberOfLines: 1,
                  ellipsizeMode: "tail",
                  maxWidth: 200,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.courseTitle}
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
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={Colors.PRIMARY}
                />
                <Text
                  style={{ fontFamily: "outfit", textDecoration: "underline" }}
                >
                  {item?.chapters?.length} Chapters
                </Text>
              </View>
              {isLoading && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color={Colors.PRIMARY} />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  courseContainer: {
    padding: 8,
    backgroundColor: Colors.GREEN,
    margin: 6,
    borderRadius: 15,
  },
});
