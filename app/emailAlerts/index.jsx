import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

const PREF_KEY = "email_preferences";

const DEFAULT_PREFS = {
  general: false,
  marketing: false,
  activity: false,
  security: true,
};

export default function EmailAlerts() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFS);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const local = await AsyncStorage.getItem(PREF_KEY);
        if (local) {
          setPreferences(JSON.parse(local));
        }

        const user = auth.currentUser;
        if (user && user.email) {
          const ref = doc(db, "users", user.email);
          const snap = await getDoc(ref);
        if (snap.exists() && snap.data().emailPreferences) {
          setPreferences(snap.data().emailPreferences);
          await AsyncStorage.setItem(
            PREF_KEY,
            JSON.stringify(snap.data().emailPreferences)
          );
        }
        }
      } catch (err) {
        console.error("Load failed", err);
      }
    };

    loadPreferences();
  }, []);

  const toggle = async (type) => {
    const updated = { ...preferences, [type]: !preferences[type] };
    setPreferences(updated);

    try {
      await AsyncStorage.setItem(PREF_KEY, JSON.stringify(updated));
      const user = auth.currentUser;
      if (user && user.email) {
        const ref = doc(db, "users", user.email);
        await setDoc(ref, { emailPreferences: updated }, { merge: true });
        console.log("Firestore update successful...");
      }
    } catch (err) {
      console.error("Save failed", err);
      Alert.alert("Error", "Failed to save preferences.");
    }
  };

  const resetToDefault = async () => {
    setPreferences(DEFAULT_PREFS);
    try {
      setLoading(true);
      await AsyncStorage.setItem(PREF_KEY, JSON.stringify(DEFAULT_PREFS));
      const user = auth.currentUser;
      if (user && user.email) {
        const ref = doc(db, "users", user.email);
        await setDoc(ref, { emailPreferences: DEFAULT_PREFS }, { merge: true });
        Alert.alert("Success", "Preferences have been reset to default.");
      }
    } catch (err) {
      console.error("Reset failed", err);
      Alert.alert("Error", "Failed to reset preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
      </TouchableOpacity>
      <Text style={styles.heading}>Email Notifications</Text>

      {renderSwitch(
        "General Updates",
        "Receive general app news and tips",
        "general",
        preferences,
        toggle
      )}
      {renderSwitch(
        "Marketing Emails",
        "Product offers, events, and promotions",
        "marketing",
        preferences,
        toggle
      )}
      {renderSwitch(
        "Activity Alerts",
        "Be notified when someone interacts with your content",
        "activity",
        preferences,
        toggle
      )}
      {renderSwitch(
        "Security Alerts",
        "Get alerts for logins and account changes",
        "security",
        preferences,
        toggle
      )}

      <TouchableOpacity
        disabled={loading}
        style={[styles.resetButton, { opacity: loading ? 0.5 : 1 }]}
        onPress={resetToDefault}
      >
        {loading ? (
          <ActivityIndicator size={"small"} color={"white"} />
        ) : (
          <Text style={styles.resetButtonText}>Reset to Default</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        Your preferences are saved to your account and device.
      </Text>
    </View>
  );
}

function renderSwitch(label, subtext, type, preferences, toggle) {
  return (
    <View style={styles.switchContainer} key={type}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtext}>{subtext}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: Colors.PRIMARY }}
        thumbColor={preferences[type] ? "#fff" : "#f4f3f4"}
        onValueChange={() => toggle(type)}
        value={preferences[type]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
    marginBottom: 30,
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
  subtext: {
    fontSize: 13,
    fontFamily: "outfit",
    color: "#aaa",
  },
  note: {
    marginTop: 30,
    fontSize: 13,
    color: "#888",
    fontFamily: "outfit",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    backgroundColor: "gray",
    zIndex: 10,
    borderRadius: 20,
  },
  resetButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});
