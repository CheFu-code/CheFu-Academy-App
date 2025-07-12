import { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import CourseListByCategory from "../../component/Explore/CourseListByCategory";
import { Colors } from "../../constant/Colors";
import { CourseCategory } from "../../constant/Option";

export default function Explore() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 🔑 used to re-render

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Trigger reload in child components
    setRefreshKey((prev) => prev + 1);

    setTimeout(() => {
      ToastAndroid.show("Courses refreshed", ToastAndroid.SHORT);
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>Explore more courses</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {CourseCategory.map((category) => (
          <View
            key={`${category}-${refreshKey}`}
            style={styles.categoryWrapper}
          >
            <CourseListByCategory category={category} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
  },
  headerWrapper: {
    padding: 25,
    marginTop: 30,
    backgroundColor: Colors.BG_COLOR,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 26,
    color: Colors.PRIMARY,
  },
  scrollContent: {
    padding: 20,
    backgroundColor: Colors.BG_COLOR,
  },
  categoryWrapper: {
    marginTop: 10,
  },
});
