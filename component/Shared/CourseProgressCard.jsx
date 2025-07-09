import { Image, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";

export default function CourseProgressCard({ item, width = 230 }) {
  if (!item) return null; // Handle case where item is undefined or null
  const GetCompletedChapters = (course) => {
    const total = course?.chapters?.length ?? 0;
    const completed = course?.completedChapter?.length ?? 0;

    if (total === 0) return 0; // avoid division by zero
    const percentage = completed / total;
    return Math.min(percentage, 1); // ensure it's not > 1
  };

  return (
    <View
      key={item?.id}
      style={{
        margin: 7,
        padding: 12,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 15,
        width: width,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        <Image
          style={{
            height: 60,
            width: 60,
            borderRadius: 8,
          }}
          source={imageAssets[item?.banner_image]}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 15,
              flexWrap: "wrap",
              maxWidth: 140,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item?.courseTitle}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 13,
            }}
          >
            {item?.chapters?.length} Chapters
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
        }}
      >
        <Progress.Bar
          color={Colors.GREEN}
          progress={GetCompletedChapters(item)}
          width={width - 24}
        />
        <Text
          style={{
            marginTop: 2,
            fontFamily: "outfit",
          }}
        >
          {item?.completedChapter?.length ?? 0} out of {item.chapters?.length}{" "}
          Chapters Completed
        </Text>
      </View>
    </View>
  );
}
