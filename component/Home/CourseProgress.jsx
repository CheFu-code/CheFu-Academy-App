import { FlatList, Text, View } from "react-native";
import { Colors } from "../../constant/Colors";
import CourseProgressCard from "../Shared/CourseProgressCard";

export default function CourseProgress({ courseList }) {
  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
          color: Colors.PRIMARY,
        }}
      >
        Progress
      </Text>
      <FlatList
        data={courseList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => <CourseProgressCard item={item} />}
      />
    </View>
  );
}
