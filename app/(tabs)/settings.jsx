import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === "dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Load saved settings
    async function loadSettings() {
      try {
        const notifValue = await AsyncStorage.getItem("notificationsEnabled");
        if (notifValue !== null) setNotificationsEnabled(JSON.parse(notifValue));
      } catch (error) {
        console.warn("Failed to load settings", error);
      }
    }
    loadSettings();

    // Listen to system color scheme changes
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === "dark");
    });
    return () => listener.remove();
  }, []);

  const toggleNotifications = async () => {
    try {
      const newVal = !notificationsEnabled;
      setNotificationsEnabled(newVal);
      await AsyncStorage.setItem("notificationsEnabled", JSON.stringify(newVal));
    } catch (error) {
      Alert.alert("Error", "Failed to save notification settings.");
    }
  };

  const onLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => console.log("User logged out") },
      ],
      { cancelable: true }
    );
  };

  const onChangePassword = () => {
    Alert.alert("Change Password", "Redirect to change password screen");
    // navigation logic here
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.heading, isDarkMode && styles.darkText]}>Account Settings</Text>
        <TouchableOpacity onPress={onChangePassword} style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <Text style={[styles.heading, isDarkMode && styles.darkText]}>Notifications</Text>
        <View style={styles.row}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Enable Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>

        <View style={styles.separator} />

        <TouchableOpacity onPress={onLogout} style={[styles.button, styles.logoutButton]}>
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  darkBackground: { backgroundColor: "#121212" },
  contentContainer: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" },
  darkText: { color: "#eee" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: { fontSize: 18, color: "#333" },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
  },
  logoutButtonText: {
    fontWeight: "700",
  },
});
