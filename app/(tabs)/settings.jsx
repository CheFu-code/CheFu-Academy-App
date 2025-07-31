import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth, sendEmailVerification } from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "@react-native-firebase/firestore";
import * as LocalAuthentication from "expo-local-authentication";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Sharing from "expo-sharing";

import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/Settings.styles";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [useBiometrics, setUseBiometrics] = useState(true);
  const [showVersion, setShowVersion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fetching, setFetching] = useState(false); // Prevent duplicate fetches
  const [fatalError, setFatalError] = useState(null);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CACHE_KEY = "@cached_courses";
  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  const options = ["Report a bug"];

  useEffect(() => {
    async function fetchSettings() {
      if (fetching) return;
      setFetching(true);
      try {
        const user = auth.currentUser;
        if (!user?.email) return;

        const docRef = doc(db, "users", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (typeof data.notifications === "boolean") {
            setNotifications(data.notifications);
          }

          if (typeof data.useBiometrics === "boolean") {
            setUseBiometrics(data.useBiometrics);
            await AsyncStorage.setItem(
              "useBiometrics",
              data.useBiometrics.toString()
            );
          }
        }
      } catch (error) {
        setFatalError(error);
        console.error("Failed to fetch settings", error);
        if (typeof ToastAndroid !== "undefined") {
          ToastAndroid.show("Failed to fetch settings", ToastAndroid.SHORT);
        }
      } finally {
        setFetching(false);
      }
    }

    try {
      fetchSettings();
    } catch (err) {
      setFatalError(err);
    }
  }, []);

  const toggleSetting = async (name, stateSetter, current) => {
    try {
      const newValue = !current;

      if (name === "Biometric Lock") {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (!compatible || !enrolled) {
          Alert.alert(
            "Biometric Unavailable",
            "Biometric authentication is not available or not set up on this device."
          );
          return;
        }
      }

      stateSetter(newValue);
      Alert.alert("Success", `${name} turned ${newValue ? "on" : "off"}`);

      try {
        const user = auth.currentUser;
        if (!user?.email) return;

        const userRef = doc(db, "users", user.email);

        await updateDoc(userRef, {
          [name === "Biometric Lock" ? "useBiometrics" : "notifications"]:
            newValue,
        });

        // 👇 Add this immediately after
        if (name === "Biometric Lock") {
          await AsyncStorage.setItem("useBiometrics", newValue.toString());
        }
      } catch (error) {
        setFatalError(error);
        console.error("Failed to update setting:", error);
        Alert.alert("Error", "Failed to save setting.");
      }
    } catch (err) {
      setFatalError(err);
      Alert.alert("Error", "A fatal error occurred in toggleSetting.");
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
      const filename = `${FileSystem.documentDirectory}my_chefu_academy_data_${safeEmail}.json`;

      await FileSystem.writeAsStringAsync(filename, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(filename, {
        mimeType: "application/json",
        dialogTitle: "Export User Data",
        UTI: "public.json",
      });
    } catch (error) {
      setFatalError(error);
      console.error("Export failed", error);
      Alert.alert("Error", "Failed to export data");
    } finally {
      setLoading(false);
    }
  }

  const logOut = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("userDetail");
      await AsyncStorage.removeItem(CACHE_KEY);
      setUserDetail(null);
      ToastAndroid.show("Logout successfully", ToastAndroid.SHORT);
    } catch (err) {
      setFatalError(err);
      Alert.alert("Error", "Failed to log out.");
    }
    return;
  };

  const SHARE_MESSAGE = "Check out CheFu Academy App!";
  const SHARE_URL = "https://chefu.academy";

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: SHARE_MESSAGE,
        message:
          Platform.OS === "ios"
            ? `${SHARE_MESSAGE} ${SHARE_URL}`
            : SHARE_MESSAGE,
        url: Platform.OS === "ios" ? SHARE_URL : undefined,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("Shared with activity type:", result.activityType);
        } else {
          // shared
          console.log("Shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("Share dismissed");
      }
    } catch (error) {
      setFatalError(error);
      Alert.alert("Sharing failed", error.message);
    }
  };

  const verify = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        setLoading(true);
        await sendEmailVerification(user);
        alert(
          `We've sent a verification email to ${user.email}! Check your inbox — and if it’s not there, don’t forget to look in your spam folder.`
        );
      } catch (error) {
        console.error("Failed to send verification email:", error);
        alert("Failed to send verification email. Try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setFatalError(new Error("No user is currently signed in from settings."));
      Alert.alert("Error", "You're currently not signed in.");
    }
  };
  let content;
  try {
    if (fatalError) {
      content = (
        <View
          style={[
            styles.container,
            { paddingTop: 50, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: "red", fontSize: 18, marginBottom: 20 }}>
            Something went wrong in Settings.
          </Text>
          <Text style={{ color: "red", fontSize: 14, marginBottom: 20 }}>
            {fatalError?.message || String(fatalError)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setFatalError(null);
            }}
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      content = (
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
                    router.push("/chatWithAdmin");
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
          >
            <Text style={styles.heading}>General</Text>
            {/* <SettingItem
              label="Edit Profile"
              icon="person"
              onPress={() => router.push("/editProfile")}
            /> */}
            <SettingItem
              label="Change Password"
              icon="lock-closed"
              onPress={() => router.push("/changePassword")}
            />
            <SettingItem
              label="Export My Data"
              icon="share-outline"
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

            {!userDetail?.roles?.includes("admin") && (
              <SettingItem
                label="Live Support"
                icon="chatbubble-ellipses"
                onPress={() => {
                  if (userDetail?.roles?.includes("admin")) {
                    ToastAndroid.show("You're an admin!", ToastAndroid.SHORT);
                    return;
                  } else {
                    router.push("/chatWithAdmin");
                  }
                }}
                disabled={loading}
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

            <SettingItem
              label="Trusted Devices"
              icon="hardware-chip"
              onPress={() => router.push("/trustedDevices")}
              disabled={loading}
            />

            <Text style={styles.heading}>About</Text>
            <SettingItem
              label="About this App"
              icon="information-circle-outline"
              onPress={() => router.push("/about")}
            />
            <SettingItem
              label="Help & Support"
              icon="help-circle-outline"
              onPress={() => {
                Linking.openURL(
                  "mailto:kurisanimaluleke77@gmail.com?subject=Support Request&body=Please describe your issue here."
                );
              }}
            />
            <SettingItem
              label="Terms of Service"
              icon="document-text-outline"
              onPress={() => router.push("/about")}
            />
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
              label="Share CheFu Academy"
              icon="share-social"
              onPress={() => handleShare()}
            />

            <Text style={styles.heading}>Account</Text>

            {userDetail?.member === true && (
              <SettingItem
                label="Subscription & Billing"
                icon="card-outline"
                onPress={() => router.push("/subscriptionAndBilling")}
              />
            )}

            {auth.currentUser &&
              !auth.currentUser.emailVerified &&
              (loading ? (
                <ActivityIndicator size={24} color={Colors.GREEN} />
              ) : (
                <SettingItem
                  label="Verify Email"
                  icon="mail"
                  onPress={() => verify()}
                  disabled={!auth.currentUser || auth.currentUser.emailVerified}
                />
              ))}

            {(userDetail?.email === "kurisanim2@gmail.com" ||
              userDetail?.roles?.includes?.("admin")) && (
              <SettingItem
                label="Admin Chat"
                icon="chatbubble-ellipses"
                onPress={() => router.push("/chatWithUsers")}
              />
            )}

            <SettingItem
              label="Buy me coffee"
              icon="exit"
              onPress={async () => {
                router.push("/buyMeCoffee");
              }}
            />
            <SettingItem
              label="Log Out"
              icon="exit-outline"
              onPress={async () => {
                await logOut();
                router.replace("/auth/signIn");
              }}
            />
          </ScrollView>
        </View>
      );
    }
  } catch (err) {
    content = (
      <View
        style={[
          styles.container,
          { paddingTop: 50, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "red", fontSize: 18, marginBottom: 20 }}>
          A fatal error occurred in Settings.
        </Text>
        <Text style={{ color: "red", fontSize: 14, marginBottom: 20 }}>
          {err?.message || String(err)}
        </Text>
      </View>
    );
  }
  return content;
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
  <View
    accessible={true}
    accessibilityRole={toggle ? "switch" : "button"}
    accessibilityLabel={label}
    style={{ opacity: disabled ? 0.5 : 1 }}
  >
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={styles.itemRow}
    >
      <View style={styles.itemLeft}>
        <Ionicons
          name={label === "Buy me coffee" ? "cafe-outline" : icon}
          size={20}
          color={
            label === "Log Out"
              ? "red"
              : label === "Buy me coffee"
              ? "yellow"
              : Colors.PRIMARY
          }
          style={{ marginRight: 12 }}
        />
        <Text
          style={[
            styles.label,
            label === "Log Out"
              ? { color: "red", fontFamily: "outfit-bold" }
              : label === "Buy me coffee"
              ? { color: "yellow", fontFamily: "space-mono" }
              : null,
          ]}
        >
          {label}
        </Text>
      </View>

      {toggle ? (
        <Switch value={value} onValueChange={disabled ? undefined : onToggle} />
      ) : (
        <Pressable onPress={disabled ? undefined : onPress} disabled={disabled}>
          <MaterialIcons name="chevron-right" size={24} color={Colors.GRAY} />
        </Pressable>
      )}
    </TouchableOpacity>
  </View>
);
