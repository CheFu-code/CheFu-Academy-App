import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

  const toggleSetting = (name, stateSetter, current) => {
    stateSetter(!current);
    Alert.alert(`${name} turned ${!current ? "on" : "off"}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>General</Text>

      <SettingItem
        label="Edit Profile"
        icon="person"
        onPress={() => Alert.alert("Edit Profile Pressed")}
      />
      <SettingItem
        label="Change Password"
        icon="lock-closed"
        onPress={() => Alert.alert("Change Password Pressed")}
      />

      <Text style={styles.heading}>Notifications</Text>

      <SettingItem
        label="Push Notifications"
        icon="notifications"
        toggle
        value={notifications}
        onToggle={() =>
          toggleSetting("Notifications", setNotifications, notifications)
        }
      />
      <SettingItem
        label="Email Alerts"
        icon="mail"
        onPress={() => Alert.alert("Email Settings Pressed")}
      />

      <Text style={styles.heading}>Privacy & Security</Text>

      <SettingItem
        label="Privacy Policy"
        icon="shield-checkmark"
        onPress={() => router.push("/privacy")}
      />
      <SettingItem
        label="Enable Biometric Lock"
        icon="finger-print"
        toggle
        value={useBiometrics}
        onToggle={() =>
          toggleSetting("Biometric Lock", setUseBiometrics, useBiometrics)
        }
      />
      <SettingItem
        label="Permissions"
        icon="lock-open"
        onPress={() => router.push("/permissions")}
      />

      <Text style={styles.heading}>About</Text>

      <SettingItem
        label="App Version"
        icon="information-circle"
        onPress={() => setShowVersion(!showVersion)}
      />
      {showVersion && (
        <View style={styles.codeBlock}>
          <Text style={styles.codeLabel}>version:</Text>
          <Text style={styles.codeText}>
            {Constants.expoConfig?.version ?? "N/A"}
          </Text>
        </View>
      )}
      <SettingItem
        label="What's New"
        icon="sparkles"
        onPress={() => Alert.alert("Release Notes Pressed")}
      />
      <SettingItem
        label="Rate the App"
        icon="star"
        onPress={() => Alert.alert("Rate Us Pressed")}
      />
      <SettingItem
        label="Share CheFu Academy"
        icon="share-social"
        onPress={() => Alert.alert("Share Pressed")}
      />

      <Text style={styles.heading}>Account</Text>

      <SettingItem
        label="Switch Account"
        icon="repeat"
        onPress={() => Alert.alert("Switch Account Pressed")}
      />
      <SettingItem
        label="Export My Data"
        icon="download"
        onPress={() => Alert.alert("Export Data Pressed")}
      />
      <SettingItem
        label="Delete Account"
        icon="trash"
        onPress={() => Alert.alert("Delete Account Pressed")}
      />
      <SettingItem
        label="Log Out"
        icon="exit"
        onPress={() => Alert.alert("Log Out Pressed")}
      />
    </ScrollView>
  );
}

const SettingItem = ({
  label,
  icon,
  toggle = false,
  value,
  onToggle,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.itemRow}>
      <View style={styles.itemLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={Colors.PRIMARY}
          style={{ marginRight: 12 }}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      {toggle ? (
        <Switch value={value} onValueChange={onToggle} />
      ) : (
        <Pressable onPress={onPress}>
          <MaterialIcons name="chevron-right" size={24} color={Colors.GRAY} />
        </Pressable>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
    marginTop: 20,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.WHITE,
  },
  codeBlock: {
    backgroundColor: Colors.CARD,
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  codeLabel: {
    color: Colors.GRAY,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  codeText: {
    color: Colors.WHITE,
    fontFamily: "outfit",
  },
  codeBlock: {
    backgroundColor: "#1e1e1e", // like VS Code dark theme
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  codeLabel: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    fontSize: 14,
    marginBottom: 4,
  },
  codeText: {
    color: "#d4d4d4",
    fontFamily: "outfit", // or any monospace font you have
    fontSize: 13,
    letterSpacing: 1.8,
  },
});
