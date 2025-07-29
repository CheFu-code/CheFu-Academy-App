import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/Header.styles";

export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    // { label: "View Profile", icon: "person-outline" },
    { label: "Contact Support", icon: "mail-outline" },
    { label: "Rate our app", icon: "star-outline", color: Colors.YELLOW },
    { label: "Logout", icon: "log-out-outline", color: Colors.RED },
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      ToastAndroid.show("Please enter a search term", ToastAndroid.SHORT);
      return;
    }

    router.push({
      pathname: "/searchResults",
      params: { query: searchTerm.trim() },
    });
    setSearchTerm("");
  };

  return (
    <View style={styles.headerContainer}>
      <View>
        <View style={styles.subHeaderContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.greeting}
          >
            Hello
            {userDetail?.fullname && (
              <Text style={{ fontFamily: "outfit-bold" }}>
                , {userDetail.fullname}
              </Text>
            )}
          </Text>

          {/**checkmark icon */}
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

          {/**show more options */}
          {userDetail && (
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Feather
                style={styles.showMoreIcon}
                name="more-horizontal"
                size={27}
                color={"white"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/*Expand knowledge with our courses */}
        <View>
          <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.text}>
            Expand your knowledge with our courses
          </Text>
        </View>

        {/*text input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search for courses..."
            placeholderTextColor={Colors.BLACK}
            autoCorrect={false}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
            style={[styles.text, { flex: 1 }]}
          />
          {searchTerm.trim() && (
            <TouchableOpacity onPress={() => handleSearch()}>
              <Ionicons
                style={styles.search}
                size={20}
                color={Colors.GREEN}
                name="search"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
