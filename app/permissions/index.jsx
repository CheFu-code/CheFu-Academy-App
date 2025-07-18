import { Ionicons } from "@expo/vector-icons";
import * as Camera from "expo-camera";

import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function Permissions() {
  // Use the Camera hook for permissions and request function
  // (No navigation button found in first 80 lines, skipping UI navigation patch)
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();

  const [permissions, setPermissions] = useState({
    camera: null,
    mediaLibrary: null,
    location: null,
    notifications: null,
  });

  const permissionDisplayNames = {
    camera: "Camera",
    mediaLibrary: "Media Library",
    location: "Location",
    notifications: "Notifications",
  };

  const checkPermissions = async () => {
    // cameraPermission may be undefined initially, so fallback to status
    const cameraStatus = cameraPermission?.status ?? "undetermined";

    const { status: mediaLibraryStatus } =
      await MediaLibrary.getPermissionsAsync();
    const { status: locationStatus } =
      await Location.getForegroundPermissionsAsync();
    const { status: notificationsStatus } =
      await Notifications.getPermissionsAsync();

    setPermissions({
      camera: cameraStatus === "granted",
      mediaLibrary: mediaLibraryStatus === "granted",
      location: locationStatus === "granted",
      notifications: notificationsStatus === "granted",
    });
  };

  const requestPermission = async (type) => {
    let result;
    switch (type) {
      case "camera":
        result = await requestCameraPermission();
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

  useEffect(() => {
    checkPermissions();
  }, [cameraPermission]);

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons
            style={{
              backgroundColor: "gray",
              borderRadius: 20,
              padding: 8,
              marginTop: 30,
            }}
            size={24}
            name="arrow-back"
            color={"white"}
          />
        </Pressable>
        <Text style={styles.title}>App Permissions</Text>
      </View>

      {Object.entries(permissions).map(([key, granted]) => (
        <View key={key} style={styles.item}>
          <Text style={styles.label}>{permissionDisplayNames[key]}</Text>

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
    marginTop: 45,
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
