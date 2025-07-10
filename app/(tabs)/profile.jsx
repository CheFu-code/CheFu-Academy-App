import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Profile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout?", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await auth.signOut();
            await AsyncStorage.removeItem("userDetail");
            setUserDetail(null);
            router.replace("/auth/signIn");
            ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
          } catch (error) {
            console.error("Logout error:", error);
            ToastAndroid.show("Logout failed", ToastAndroid.SHORT);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const confirmDeleteAccount = () => {
    setShowPasswordModal(true);
  };

  const handleDeleteAccount = async () => {
    if (!password) return;

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        ToastAndroid.show("No user is logged in", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await user.delete();

      await AsyncStorage.removeItem("userDetail");
      setUserDetail(null);
      setShowPasswordModal(false);
      setPassword("");
      ToastAndroid.show("Account deleted successfully", ToastAndroid.SHORT);
      router.replace("/auth/signIn");
      setLoading(false);
    } catch (error) {
      console.error("Delete account error:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        ToastAndroid.show("Incorrect password", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to delete account", ToastAndroid.SHORT);
      }
      setLoading(false);
    }
  };

  const url =
    "https://play.google.com/store/apps/details?id=com.chefu.chefuacademy";

  const menuItems = [
    {
      label: "Add Course",
      icon: "add-circle-outline",
      onPress: () => router.push("/addCourse"),
    },
    {
      label: "My Courses",
      icon: "book-outline",
      onPress: () => router.push("/(tabs)/home"),
    },
    {
      label: "Course Progress",
      icon: "stats-chart-outline",
      onPress: () => router.push("/(tabs)/progress"),
    },
    {
      label: "Help & Support",
      icon: "help-circle-outline",
      onPress: () =>
        Linking.openURL(
          "mailto:kurisanimaluleke77@gmail.com?subject=Support Request&body=Please describe your issue here."
        ),
    },
    {
      label: "Privacy Policy",
      icon: "shield-checkmark-outline",
      onPress: () => router.push("/privacy"),
    },
    {
      label: "Terms of Service",
      icon: "document-text-outline",
      onPress: () => router.push("/terms"),
    },];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.avatar}
        />
        {userDetail && (
          <>
            <Text style={styles.profileName}>{userDetail.fullname}</Text>
            <Text style={styles.profileEmail}>{userDetail.email}</Text>
            <TouchableOpacity style={[styles.planStatus]}>
              <Text
                style={{
                  color: userDetail.member ? Colors.GREEN : Colors.RED,
                  textDecorationLine:
                    userDetail?.member === false ? "underline" : "none",
                }}
              >
                {userDetail.member ? "Member Plan" : "Free Plan"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={item.onPress}
              disabled={loading}
            >
              <Ionicons
                name={item.icon}
                size={26}
                color={Colors.PRIMARY}
                style={styles.icon}
              />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 5 }]}
            onPress={() => router.push("/about")}
            disabled={loading}
          >
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={Colors.PRIMARY}
              style={styles.icon}
            />
            <Text style={[styles.menuLabel, { color: Colors.PRIMARY }]}>
              About This App
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 5 }]}
            onPress={() =>
              Linking.openURL(url).catch((err) => {
                console.error("Failed to open URL:", err);
                ToastAndroid.show(
                  "Failed to open Google Play store",
                  ToastAndroid.SHORT
                );
              })
            }
            disabled={loading}
          >
            <Ionicons
              name="cloud-download-outline"
              size={26}
              color={Colors.GREEN}
              style={styles.icon}
            />
            <Text style={[styles.menuLabel, { color: Colors.GREEN}]}>
              Check for Updates
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 5 }]}
            onPress={confirmDeleteAccount}
            disabled={loading}
          >
            <Ionicons
              name="trash-outline"
              size={26}
              color={Colors.RED}
              style={styles.icon}
            />
            <Text style={[styles.menuLabel, { color: Colors.RED }]}>
              Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 5 }]}
            onPress={handleLogout}
            disabled={loading}
          >
            <Ionicons
              name="log-out-outline"
              size={26}
              color={Colors.RED}
              style={styles.icon}
            />
            <Text style={[styles.menuLabel, { color: Colors.RED }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            textAlign: "center",
            color: Colors.GRAY,
            marginTop: 10,
            marginBottom: 20,
            fontFamily: "outfit",
          }}
        >
          App Version {Constants.expoConfig?.version ?? "N/A"}
        </Text>
      </ScrollView>

      {/* Password Modal */}
      <Modal transparent visible={showPasswordModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.inputWithIcon}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: Colors.GRAY,
                    disabled: loading,
                    opacity: loading ? 0.5 : 1,
                  },
                ]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: Colors.RED,
                    disabled: !password,
                    opacity: !password || loading ? 0.5 : 1,
                  },
                ]}
                onPress={handleDeleteAccount}
              >
                {loading ? (
                  <ActivityIndicator size={"large"} color={"white"} />
                ) : (
                  <Text style={styles.modalButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
  },
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    marginBottom: 15,
    marginTop: 30,
  },
  profileName: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  profileEmail: {
    fontSize: 15,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginTop: 3,
  },
  planStatus: {
    fontSize: 15,
    fontFamily: "outfit",
    marginTop: 5,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 17,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.BG_COLOR,
    width: "85%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    fontFamily: "outfit",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontFamily: "outfit-bold",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },

  inputWithIcon: {
    flex: 1,
    color: "#fff",
    fontFamily: "outfit",
    fontSize: 16,
    paddingRight: 10, // spacing before the icon
  },
});
