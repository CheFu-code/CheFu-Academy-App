import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constant/Colors";

export default function CourseListGrid({ courseList, option }) {
  const router = useRouter();

  const onPress = (course) => {
    router.push({
      pathname: option.path,
      params: {
        courseParams: JSON.stringify(course),
      },
    });
  };

  return (
    <View>
      <FlatList
        numColumns={2}
        style={{
          padding: 20,
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 15,
              backgroundColor: Colors.BG_GRAY,
              margin: 7,
              borderRadius: 15,
              elevation: 1,
              minWidth: 130,
              maxWidth: 150,
            }}
            key={index}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.PRIMARY}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
              }}
            />
            <View
              style={{
                width: "100%",
                height: 70,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
                source={option?.icon}
              />
            </View>
            <Text
              style={{
                fontFamily: "outfit",
                textAlign: "center",
                marginTop: 7,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.courseTitle}
            </Text>
          </TouchableOpacity>
        )}
        data={courseList}
      />
    </View>
  );
}
