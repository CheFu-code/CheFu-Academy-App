import { FlatList, Text, View } from "react-native";
import CourseListByCategory from "../../component/Explore/CourseListByCategory";
import { Colors } from "../../constant/Colors";
import { CourseCategory } from "../../constant/Option";

export default function Explore() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
      }}
    >
      <View
        style={{
          padding: 25,
          marginTop: 30,
          backgroundColor: Colors.BG_COLOR,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 26,
            color: Colors.PRIMARY,
          }}
        >
          Explore more courses
        </Text>
      </View>

      <FlatList
        style={{
          backgroundColor: Colors.BG_COLOR,
          flex: 1,
        }}
        data={[]}
        ListHeaderComponent={
          <View
            style={{
              padding: 20,
              backgroundColor: Colors.BG_COLOR,
            }}
          >
            {CourseCategory.map((item, index) => (
              <View
                style={{
                  marginTop: 10,
                }}
                key={item}
              >
                <CourseListByCategory category={item} />
              </View>
            ))}
          </View>
        }
      />
    </View>
  );
}
