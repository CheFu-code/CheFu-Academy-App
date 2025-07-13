import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constant/Colors";

const TabLayout = () => {
  // useEffect(() => {
  //   NavigationBar.hide();
  // }, []);

  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingBottom: insets.bottom,
          backgroundColor: "black",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 60,
          position: "absolute",
          bottom: 50,
          shadowColor: Colors.PRIMARY,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={{
                marginTop: 20,
                height: "100%",
              }}
              name="home-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={{
                marginTop: 20,
                height: "100%",
              }}
              name="search-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Explore",
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={{
                marginTop: 20,
                height: "100%",
              }}
              name="bar-chart-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Progress",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={{
                marginTop: 20,
                height: "100%",
              }}
              name="person-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
