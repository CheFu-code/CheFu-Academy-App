import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  signOut,
} from "@react-native-firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";

import { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constant/Colors";
import { menuItems, url } from "../../constant/menuItems";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/Profile.styles";

export default function Profile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const renderedMenuItems = menuItems(router, Linking, ToastAndroid, Colors);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const auth = getAuth();

  const [fetching, setFetching] = useState(false); // Prevent duplicate refresh

  const refreshData = async () => {
    if (fetching) return;
    setRefreshing(true);
    setFetching(true);
    try {
      const firestore = getFirestore();
      const userDocSnap = await getDoc(
        doc(firestore, "users", userDetail.email)
      );

      if (userDocSnap.exists()) {
        setUserDetail(userDocSnap.data());
        ToastAndroid.show("Profile refreshed", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Your data not found", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      if (typeof ToastAndroid !== "undefined") {
        ToastAndroid.show("Failed to refresh profile", ToastAndroid.SHORT);
      }
      if (typeof Sentry !== "undefined") {
        Sentry.captureException(error);
      }
    } finally {
      setRefreshing(false);
      setFetching(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Logout?", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut(getAuth());
            await AsyncStorage.removeItem("userDetail");
            setUserDetail(null);
            router.push("/auth/signIn");
            ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
          } catch (error) {
            console.error("Logout error:", error);
            ToastAndroid.show("Logout failed", ToastAndroid.SHORT);
            Sentry.captureException(error);
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
      const auth = getAuth();
      const firestore = getFirestore();
      const user = auth.currentUser;

      if (!user || !user.email) {
        ToastAndroid.show("No user is logged in", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      const userDocRef = doc(firestore, "users", user.email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const deletedRef = doc(
          firestore,
          "deletedAccounts",
          user.email + user.uid
        );
        await setDoc(deletedRef, {
          ...userData,
          email: user.email,
          deletedAt: new Date(),
        });

        await deleteDoc(userDocRef);
      } else {
        console.warn("⚠️ No user document found in Firestore for", user.email);
      }

      await deleteUser(user);

      await AsyncStorage.removeItem("userDetail");
      setUserDetail(null);
      setShowPasswordModal(false);
      setPassword("");
      ToastAndroid.show("Account deleted successfully", ToastAndroid.SHORT);
      router.push("/");
    } catch (error) {
      console.error("❌ Delete account error:", error);
      Sentry.captureException(error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        ToastAndroid.show("Incorrect password", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to delete account", ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  const subscribe = () => {
    if (userDetail.member === true) {
      ToastAndroid.show("You're already on member plan", ToastAndroid.SHORT);
      return;
    } else {
      router.push("/subscription");
    }
  };

  const verify = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        alert(
          `We've sent a verification email to ${user.email}! Check your inbox — and if it’s not there, don’t forget to look in your spam folder.`
        );
      } catch (error) {
        console.error("Failed to send verification email:", error);
        if (
          error.code === "auth/too-many-requests" ||
          error.message.includes("too-many-requests")
        ) {
          alert(
            "You've tried too many times. We’ve temporarily blocked requests from this device due to unusual activity. Please try again later."
          );
        } else {
          alert("Failed to send verification email. Please try again later.");
        }
      }
    } else {
      alert("No user is currently signed in.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={[
            styles.avatar,
            {
              borderColor:
                userDetail?.member === true ? Colors.GREEN : Colors.PRIMARY,
            },
          ]}
        />

        {userDetail && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text numberOfLines={1} style={styles.profileName}>
                {userDetail.fullname}
              </Text>
              {userDetail?.member === true && (
                <Ionicons color={"green"} size={20} name="checkmark-circle" />
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text style={styles.profileEmail}>{userDetail.email}</Text>
              {auth.currentUser && !auth.currentUser.emailVerified && (
                <TouchableOpacity onPress={() => verify()}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.profileEmail,
                      {
                        color: Colors.LIGHT_RED,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    email not verified
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => subscribe()}
              disabled={loading}
              style={[styles.planStatus]}
            >
              {loading ? (
                <ActivityIndicator color={"green"} size={"small"} />
              ) : (
                <Text
                  style={{
                    color: userDetail.member ? Colors.GREEN : Colors.RED,
                    textDecorationLine:
                      userDetail?.member === false ? "underline" : "none",
                    fontFamily: "outfit-bold",
                  }}
                >
                  {userDetail?.planType && (
                    <Text>{`${capitalize(userDetail.planType)} Plan`}</Text>
                  )}
                  {userDetail?.member === false && <Text>Free Plan</Text>}
                </Text>
              )}
            </TouchableOpacity>
            {userDetail.planType && (
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 15,
                  marginTop: 5,
                  color: "#ccc",
                }}
              >
                Your plan will expire on{" "}
                {new Date(userDetail.memberUntil).toLocaleDateString()}
              </Text>
            )}
          </>
        )}
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <View style={styles.menuSection}>
          {renderedMenuItems.map((item) => (
            // {menuItems.map((item) => (
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

          {userDetail?.member === false && (
            <TouchableOpacity
              style={[styles.menuItem, { marginTop: 5 }]}
              onPress={() => subscribe()}
              disabled={loading}
            >
              <FontAwesome5
                name="money-bill-wave"
                size={20}
                color={Colors.GREEN}
                style={styles.icon}
              />
              <Text style={[styles.menuLabel, { color: Colors.GREEN }]}>
                Subscribe
              </Text>
            </TouchableOpacity>
          )}

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
            <Text style={[styles.menuLabel, { color: Colors.GREEN }]}>
              Check for App Updates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 5 }]}
            onPress={() => {
              if (userDetail?.isVerified === false) {
                ToastAndroid.show(
                  "Please verify your email to access your downloaded courses.",
                  ToastAndroid.LONG
                );
                return;
              } else {
                router.push("/download");
              }
            }}
          >
            <FontAwesome6
              name="download"
              size={24}
              color={Colors.PRIMARY}
              style={styles.icon}
            />
            <Text style={[styles.menuLabel, { color: Colors.PRIMARY }]}>
              Downloaded Courses
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
            marginBottom: 30,
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
    </SafeAreaView>
  );
}
