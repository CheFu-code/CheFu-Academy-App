import { Ionicons } from "@expo/vector-icons";
import * as Camera from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function Permissions() {
  const [permissions, setPermissions] = useState({
    camera: null,
    mediaLibrary: null,
    location: null,
    notifications: null,
  });

  const checkPermissions = async () => {
    const { status: camera } = await Camera.getCameraPermissionsAsync();
    const { status: mediaLibrary } = await MediaLibrary.getPermissionsAsync();
    const { status: location } = await Location.getForegroundPermissionsAsync();
    const { status: notifications } = await Notifications.getPermissionsAsync();

    setPermissions({
      camera: camera === "granted",
      mediaLibrary: mediaLibrary === "granted",
      location: location === "granted",
      notifications: notifications === "granted",
    });
  };

  const requestPermission = async (type) => {
    let result;
    switch (type) {
      case "camera":
        result = await Camera.requestCameraPermissionsAsync();
        break;
      case "mediaLibrary":
        result = await MediaLibrary.requestPermissionsAsync();
        break;
      case "location":
        result = await Location.requestForegroundPermissionsAsync();
        break;
      case "notifications":
        result = await Notifications.requestPermissionsAsync();
        break;
    }
    if (result?.status) checkPermissions();
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Permissions</Text>
      {Object.entries(permissions).map(([key, granted]) => (
        <View key={key} style={styles.item}>
          <Text style={styles.label}>{key.replace(/([A-Z])/g, " $1")}</Text>
          <TouchableOpacity
            onPress={() => requestPermission(key)}
            style={[styles.button, granted ? styles.granted : styles.denied]}
          >
            <Ionicons
              name={granted ? "checkmark-circle" : "close-circle"}
              size={24}
              color={granted ? "green" : "red"}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.buttonText}>
              {granted ? "Granted" : "Request"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={openSettings} style={styles.settingsButton}>
        <Text style={styles.settingsText}>Open App Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.WHITE,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  granted: {
    backgroundColor: "rgba(0,255,0,0.1)",
  },
  denied: {
    backgroundColor: "rgba(255,0,0,0.1)",
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: "outfit",
  },
  settingsButton: {
    marginTop: 30,
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  settingsText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
});
