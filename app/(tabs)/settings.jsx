import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
} from "@react-native-firebase/firestore";

import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [showVersion, setShowVersion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  const options = ["Report a bug"];

  useEffect(() => {
    const fetchNotificationSetting = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docSnap = await db.collection("users").doc(user.email).get();
        if (docSnap.exists) {
          const data = docSnap.data();
          if (typeof data.notifications === "boolean") {
            setNotifications(data.notifications);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notification setting", error);
      }
    };

    fetchNotificationSetting();
  }, []);

  const toggleSetting = async (name, stateSetter, current) => {
    const newValue = !current;
    stateSetter(newValue);
    Alert.alert(`${name} turned ${newValue ? "on" : "off"}`);

    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(collection(db, "users"), user.email); // ✅

      await userRef.update({
        notifications: newValue,
      });
    } catch (error) {
      console.error("Failed to update setting:", error);
      Alert.alert("Error", "Failed to save setting.");
    }
  };

  async function exportUserData() {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user?.email) {
        Alert.alert("Error", "User not logged in");
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Alert.alert("Error", "No user data found to export");
        setLoading(false);
        return;
      }

      const userData = docSnap.data();
      const json = JSON.stringify(userData, null, 2);
      const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${FileSystem.documentDirectory}userdata_${safeEmail}.json`;

      await FileSystem.writeAsStringAsync(filename, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(filename, {
        mimeType: "application/json",
        dialogTitle: "Export User Data",
        UTI: "public.json",
      });
    } catch (error) {
      console.error("Export failed", error);
      Alert.alert("Error", "Failed to export data");
    } finally {
      setLoading(false);
    }
  }

  const logOut = async () => {
    await auth.signOut();
    ToastAndroid.show("Logout successfully", ToastAndroid.SHORT);
    return;
  };

  return (
    <View style={[styles.container, { paddingTop: 50 }]}>
      {/* Header + Dropdown Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <MaterialIcons
            name="unfold-more"
            size={24}
            style={styles.icon}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelected(item);
                Linking.openURL("mailto:kurisanimaluleke77@gmail.com");
                setIsOpen(false);
              }}
              style={styles.option}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Settings List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Text style={styles.heading}>General</Text>
        <SettingItem
          label="Edit Profile"
          icon="person"
          onPress={() => router.push("/editProfile")}
        />
        <SettingItem
          label="Change Password"
          icon="lock-closed"
          onPress={() => router.push("/changePassword")}
        />
        <SettingItem
          label="Export My Data"
          icon="download"
          onPress={exportUserData}
          disabled={loading}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color={Colors.PRIMARY}
            style={{ marginBottom: 10 }}
          />
        )}

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
          onPress={() => router.push("/emailAlerts")}
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
          label="Delete Account"
          icon="trash"
          onPress={() => Alert.alert("Delete Account Pressed")}
        />
        <SettingItem label="Log Out" icon="exit" onPress={() => logOut()} />
      </ScrollView>
    </View>
  );
}

const SettingItem = ({
  label,
  icon,
  toggle = false,
  value,
  onToggle,
  onPress,
  disabled,
}) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
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
        <Pressable onPress={onPress} disabled={disabled}>
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
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: "white",
  },
  icon: {
    backgroundColor: "gray",
    padding: 5,
    borderRadius: 20,
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 95,
    backgroundColor: "#333",
    borderRadius: 8,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: 130,
    paddingLeft: 8,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    textAlign: "center",
  },
  optionText: {
    color: "#fff",
    fontFamily: "outfit",
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
    backgroundColor: "#1e1e1e",
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
    fontFamily: "outfit",
    fontSize: 13,
    letterSpacing: 1.8,
  },
});
