import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Profile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const menuItems = [
    {
      label: "Add Course",
      icon: "add-circle-outline",
      onPress: () => router.push("/addCourse"),
    },
    {
      label: "My Courses",
      icon: "book-outline",
      onPress: () => router.push("/(tabs)/home"),
    },
    {
      label: "Course Progress",
      icon: "stats-chart-outline",
      onPress: () => router.push("/(tabs)/progress"),
    },
    // {
    //   label: "My Subscription",
    //   icon: "card-outline",
    //   onPress: () => router.push("/subscription"),
    // },
    {
      label: "Logout",
      icon: "log-out-outline",
      onPress: async () => {
        setLoading(true);
        setUserDetail(null); // clear context

        // Optionally clear AsyncStorage if you're storing tokens
        // import AsyncStorage from '@react-native-async-storage/async-storage';
        // await AsyncStorage.clear();

        router.replace("/auth/signIn"); // navigate to login screen
        setLoading(false);
      },
      color: Colors.RED,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={{
            marginTop: Platform.OS === "ios" ? 30 : 0,
            width: 160,
            height: 160,
          }}
          source={require("../../assets/images/logo.png")}
        />
        {userDetail && (
          <>
            <Text style={styles.profileName}>{userDetail.fullname}</Text>
            <Text style={styles.profileEmail}>{userDetail.email}</Text>
            <Text
              style={[
                styles.profileEmail,
                { color: userDetail.member ? Colors.GREEN : Colors.RED },
              ]}
            >
              {userDetail.member === false ? "Free Plan" : "Member Plan"}
            </Text>
          </>
        )}
      </View>
      <View style={styles.menuSection}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Ionicons
              name={item.icon}
              size={28}
              color={item.color || Colors.PRIMARY}
              style={{ marginRight: 18 }}
            />
            <Text
              style={[styles.menuLabel, item.color && { color: item.color }]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  profileName: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    marginTop: 10,
    color: Colors.PRIMARY,
  },
  profileEmail: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
    marginTop: 4,
  },
  menuSection: {
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.BG_GRAY,
  },
  menuLabel: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.PRIMARY,
  },
});
