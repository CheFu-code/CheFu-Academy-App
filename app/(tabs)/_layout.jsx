import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constant/Colors";

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView
            tint="default" // 'light', 'dark', or 'default'
            intensity={100}
            style={{
              flex: 1,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              marginHorizontal: 10,
              marginBottom: 20,
              marginTop: 30,
              position: "absolute",
              bottom: 30,
              height: 60 + insets.bottom,
              overflow: "hidden",
              backgroundColor: "rgba(255, 255, 255, 0.2)", // semi-transparent tint for glass effect
              shadowColor: Colors.PRIMARY,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
              borderColor: "black",
            }}
          />
        ),
        tabBarStyle: {
          paddingBottom: insets.bottom,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          height: 60,
          marginHorizontal: 10,
          elevation: 5,
          shadowColor: "rgba(255, 255, 255, 0.3)",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          bottom: 30,
          marginBottom: 20,
          marginTop: 30,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={{
                marginTop: 25,
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
                marginTop: 25,
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
                marginTop: 25,
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
                marginTop: 25,
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
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={{
                marginTop: 25,
                height: "100%",
              }}
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
