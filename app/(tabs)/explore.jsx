import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from "react-native";
import CourseListByCategory from "../../component/Explore/CourseListByCategory";
import { Colors } from "../../constant/Colors";
import { CourseCategory } from "../../constant/Option";

export default function Explore() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const renderItem = ({ item }) => (
    <View style={styles.categoryWrapper}>
      <CourseListByCategory category={item} />
    </View>
  );

  const onRefresh = useCallback(() => {
    if (refreshing) return; 
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

  if (refreshing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.BG_COLOR,
        }}
      >
        <LottieView
          autoPlay
          loop
          source={require("../../assets/animations/Loading.json")}
          style={{
            width: 150,
            height: 150,
          }}
        />
        <Text
          style={{
            marginTop: 10,
            fontFamily: "outfit-bold",
            fontSize: 16,
            color: Colors.PRIMARY,
          }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>Explore more courses</Text>
      </View>

      <FlatList
        style={styles.scrollContent}
        data={CourseCategory}
        keyExtractor={(item) => `${item}-${refreshKey}`}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
