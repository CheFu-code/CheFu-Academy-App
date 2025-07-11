import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";

export default function CourseProgressCard({
  item,
  width = 230,
  loading = false,
  disabled = false,
  onPress = null,
}) {
  if (!item) return null; // Handle case where item is undefined or null

  const GetCompletedChapters = (course) => {
    const total = course?.chapters?.length ?? 0;
    const completed = course?.completedChapter?.length ?? 0;
    if (total === 0) return 0; // avoid division by zero
    const percentage = completed / total;
    return Math.min(percentage, 1); // ensure it's not > 1
  };

  const notificationSentKey = `notificationSent-${item?.courseTitle}`;

  useEffect(() => {
    async function checkAndSendNotification() {
      if (!item) {
        console.log("No course item provided.");
        return;
      }

      if (item.completedChapter?.length === item.chapters?.length) {
        // Check if notification was already sent for this course
        const sent = await AsyncStorage.getItem(notificationSentKey);

        if (sent === "true") {
          return; // already sent, do nothing
        }

        const { status } = await Notifications.getPermissionsAsync();

        if (status !== "granted") {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();
          if (newStatus !== "granted") {
            console.log(
              "Notification permission not granted, aborting notification."
            );
            return;
          }
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Course Completed!",
            body: `You completed all chapters in "${item.courseTitle}"!`,
            sound: true,
          },
          trigger: null,
        });

        await AsyncStorage.setItem(notificationSentKey, "true");
      } else {
        console.log(`Course "${item.courseTitle}" not completed yet.`);
      }
    }

    checkAndSendNotification();
  }, [
    item?.completedChapter?.length,
    item?.chapters?.length,
    item?.courseTitle,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        margin: 7,
        padding: 12,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 15,
        width,
        opacity: disabled || loading ? 0.5 : 1,
        position: "relative",
      }}
    >
      <View
        style={{
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 13,
              }}
            >
              {item?.chapters?.length} Chapters
            </Text>

            {item?.completedChapter?.length === item.chapters?.length && (
              <Ionicons color={"green"} size={16} name="checkmark" />
            )}
          </View>
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

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          {item?.completedChapter?.length === item.chapters?.length && (
            <FontAwesome color={"green"} name="flag-checkered" />
          )}

          <Text
            style={{
              marginTop: 2,
              fontFamily: "outfit",
            }}
          >
            {item?.completedChapter?.length === item?.chapters?.length ? (
              <Text
                style={{
                  color: "green",
                  fontFamily: "outfit-bold",
                }}
              >
                All chapters completed!
              </Text>
            ) : (
              `${item?.completedChapter?.length ?? 0} of ${
                item.chapters?.length
              } chapters completed!`
            )}
          </Text>
        </View>
      </View>

      {loading && (
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
          <ActivityIndicator size="large" color={Colors.GREEN} />
        </View>
      )}
    </TouchableOpacity>
  );
}
