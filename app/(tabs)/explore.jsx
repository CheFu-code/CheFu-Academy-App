import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
    if (refreshing) return; // Prevent double refresh
    setRefreshing(true);
    try {
      setRefreshKey((prev) => prev + 1);
      setTimeout(() => {
        ToastAndroid.show("Courses refreshed", ToastAndroid.SHORT);
        setRefreshing(false);
      }, 1000);
    } catch (err) {
      ToastAndroid.show("Failed to refresh", ToastAndroid.SHORT);
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>Explore more courses</Text>
      </View>
      <View
        style={{
          marginTop: -16,
          position: "relative",
          marginHorizontal: 15,
        }}
      >
        <TextInput
          style={{
            color: Colors.BLACK,
            backgroundColor: "#f0f0f0",
            paddingHorizontal: 20,
            paddingRight: 45,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            fontSize: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          placeholder="Filter courses by category"
          placeholderTextColor="#888"
        />
        <Ionicons
          name="filter-circle-outline"
          size={25}
          color={Colors.BLACK}
          style={{
            position: "absolute",
            right: 15,
            top: "50%",
            transform: [{ translateY: -22 }], 
            // backgroundColor:"red",
            padding:10
          }}
        />
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
