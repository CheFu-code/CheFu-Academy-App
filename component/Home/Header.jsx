import { Foundation, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const handleOption = async (option) => {
    setShowModal(false);

    if (option === "Logout") {
      try {
        await auth.signOut();
        await AsyncStorage.removeItem("userDetail");
        setUserDetail(null);
        ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
        router.replace("/auth/signIn");
      } catch (error) {
        if (error.code === "auth/no-current-user") {
          ToastAndroid.show("You're not logged in", ToastAndroid.SHORT);
        } else if (error.code === "auth/user-not-found") {
          ToastAndroid.show("User not found", ToastAndroid.SHORT);
        } else if (error.code === "auth/network-request-failed") {
          ToastAndroid.show(
            "Network error, please try again",
            ToastAndroid.SHORT
          );
        } else if (error.code === "auth/too-many-requests") {
          ToastAndroid.show(
            "Too many requests, please try again later",
            ToastAndroid.SHORT
          );
        } else if (error.code === "auth/operation-not-allowed") {
          ToastAndroid.show("Operation not allowed", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(
            "An error occurred, please try again",
            ToastAndroid.SHORT
          );
          console.error("Logout error on header:", error);
        }
      }
    } else if (option === "Rate our app") {
      // Handle rate our app action
      const url =
        "https://play.google.com/store/apps/details?id=com.chefu.chefuacademy";
      Linking.openURL(url).catch((err) => {
        console.error("Failed to open URL:", err);
        ToastAndroid.show(
          "Failed to open Google Play store",
          ToastAndroid.SHORT
        );
      });
    } else if (option === "View Profile") {
      router.push("/(tabs)/profile");
    } else if (option === "Contact Support") {
      Linking.openURL(
        "mailto:kurisanimaluleke77@gmail.com?subject=Support Request&body=Please describe your issue here."
      );
    } else if (option === "Add Course") {
      router.push("/addCourse");
    }
  };

  const modalOptions = [
    { label: "Add Course", icon: "add-circle-outline" },
    { label: "View Profile", icon: "person-outline" },
    { label: "Contact Support", icon: "mail-outline" },
    { label: "Rate our app", icon: "star-outline", color: Colors.YELLOW },
    { label: "Logout", icon: "log-out-outline", color: Colors.RED },
  ];

  return (
    <View style={styles.headerContainer}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text numberOfLines={1} style={styles.greeting}>
            Hello{userDetail && `, ${userDetail?.fullname}`}
          </Text>
          {userDetail?.member === true && (
            <Ionicons
              style={{
                marginTop: 35,
              }}
              color={Colors.PRIMARY}
              size={20}
              name="checkmark-circle"
            />
          )}
        </View>
        <Text style={styles.subText}>Expand Your Knowledge</Text>
      </View>

      {userDetail && (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Foundation style={{
            padding: 10,
            backgroundColor: Colors.GRAY,
            borderRadius: 100,
            elevation: 5,
            marginTop: 10,
          }} name="indent-more" size={27} color={"white"} />
        </TouchableOpacity>
      )}

      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          onPress={() => setShowModal(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Settings</Text>

            {modalOptions.map(({ label, icon, color }) => (
              <TouchableOpacity
                key={label}
                onPress={() => handleOption(label)}
                style={styles.modalItem}
              >
                <Ionicons
                  name={icon}
                  size={24}
                  color={color || Colors.PRIMARY}
                  style={styles.modalIcon}
                />
                <Text style={[styles.modalText, color && { color }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  greeting: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: "#fff",
    marginTop: 35,
    maxWidth: 200,
  },
  subText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GREEN,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: Colors.BG_COLOR,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.PRIMARY,
    marginBottom: 15,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  modalIcon: {
    marginRight: 16,
  },
  modalText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.PRIMARY,
  },
});
