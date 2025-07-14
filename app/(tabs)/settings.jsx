import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [mobileDataDownload, setMobileDataDownload] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const router = useRouter();

  const toggleSetting = (name, stateSetter, current) => {
    console.log(`Toggling ${name} from ${current} to ${!current}`);
    stateSetter(!current);
    Alert.alert(`${name} turned ${!current ? "on" : "off"}`);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>{"general"}</Text>

        <SettingItem
          label={"editProfile"}
          icon="person"
          onPress={() => Alert.alert("editProfile")}
        />
        <SettingItem
          label={"changePassword"}
          icon="lock-closed"
          onPress={() => Alert.alert("changePassword")}
        />
        <SettingItem
          label={"darkMode"}
          icon="moon"
          toggle
          value={darkMode}
          onToggle={() => toggleSetting("darkMode", setDarkMode, darkMode)}
        />

        <Text style={styles.heading}>{"notifications"}</Text>
        <SettingItem
          label={"pushNotifications"}
          icon="notifications"
          toggle
          value={notifications}
          onToggle={() =>
            toggleSetting(
              "pushNotifications",
              setNotifications,
              notifications
            )
          }
        />
        <SettingItem
          label={"emailAlerts"}
          icon="mail"
          onPress={() => Alert.alert("emailAlerts")}
        />
        <SettingItem
          label={"courseReminders"}
          icon="alarm"
          onPress={() => Alert.alert("courseReminders")}
        />

        <Text style={styles.heading}>{"downloads"}</Text>
        <SettingItem
          label={"useMobileData"}
          icon="cellular"
          toggle
          value={mobileDataDownload}
          onToggle={() =>
            toggleSetting(
              "useMobileData",
              setMobileDataDownload,
              mobileDataDownload
            )
          }
        />
        <SettingItem
          label={"manageStorage"}
          icon="cloud"
          onPress={() => Alert.alert("manageStorage")}
        />

        <Text style={styles.heading}>{"learningPreferences"}</Text>
        <SettingItem
          label={"fontSize"}
          icon="text"
          onPress={() => Alert.alert("fontSize")}
        />
        <SettingItem
          label={"readingMode"}
          icon="book"
          onPress={() => Alert.alert("readingMode")}
        />
        <SettingItem
          label={"videoPlaybackSpeed"}
          icon="play"
          onPress={() => Alert.alert("videoPlaybackSpeed")}
        />

        <Text style={styles.heading}>{"privacySecurity"}</Text>
        <SettingItem
          label={"privacyPolicy"}
          icon="shield-checkmark"
          onPress={() => router.push("/privacy")}
        />
        <SettingItem
          label={"enableBiometricLock"}
          icon="finger-print"
          toggle
          value={useBiometrics}
          onToggle={() =>
            toggleSetting(
              "enableBiometricLock",
              setUseBiometrics,
              useBiometrics
            )
          }
        />
        <SettingItem
          label={"permissions"}
          icon="lock-open"
          onPress={() => Alert.alert("permissions")}
        />

        <Text style={styles.heading}>{"about"}</Text>
        <SettingItem
          label={"appVersion"}
          icon="information-circle"
          onPress={() => Alert.alert("Version 1.0.0")}
        />
        <SettingItem
          label={"whatsNew"}
          icon="sparkles"
          onPress={() => Alert.alert("whatsNew")}
        />
        <SettingItem
          label={"rateTheApp"}
          icon="star"
          onPress={() => Alert.alert("rateTheApp")}
        />
        <SettingItem
          label={"shareApp"}
          icon="share-social"
          onPress={() => Alert.alert("shareApp")}
        />

        <Text style={styles.heading}>{"account"}</Text>
        <SettingItem
          label={"switchAccount"}
          icon="repeat"
          onPress={() => Alert.alert("switchAccount")}
        />
        <SettingItem
          label={"exportMyData"}
          icon="download"
          onPress={() => Alert.alert("exportMyData")}
        />
        <SettingItem
          label={"deleteAccount"}
          icon="trash"
          onPress={() => Alert.alert("deleteAccount")}
        />
        <SettingItem
          label="logOut"
          icon="exit"
          onPress={() => Alert.alert("logOut")}
        />
      </ScrollView>
    </>
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
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View style={styles.itemRow}>
      <View style={styles.itemLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={
            label === "Log Out" || label === "Delete Account"
              ? Colors.RED
              : Colors.PRIMARY
          }
          style={{ marginRight: 12 }}
        />
        <Text
          style={[
            styles.label,
            {
              color:
                label === "Log Out" || label === "Delete Account"
                  ? Colors.RED
                  : Colors.PRIMARY,
            },
          ]}
        >
          {label}
        </Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.BG_COLOR,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
    marginBottom: 10,
  },
  languageOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  languageText: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.WHITE,
  },
});
