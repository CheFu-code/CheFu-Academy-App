// --- Imports ---
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  View,
} from "react-native";

// --- Icons ---
import { FontAwesome6, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

// --- Firebase ---
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

// --- Shared ---
import * as Sentry from "@sentry/react-native";
import AppModal from "../../component/Shared/AppModal";
import { Colors } from "../../constant/Colors";
import { menuItems, url } from "../../constant/menuItems";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/Profile.styles";

export default function Profile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const auth = getAuth();

  // Destructure to reduce repeated optional chaining
  const {
    email,
    fullname,
    member,
    memberUntil,
    planType,
    profilePicture,
    provider,
  } = userDetail || {};

  // --- Local States ---
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchingRef = useRef(false); // Use ref to avoid re-renders when tracking fetching

  const isFreeUser = !member;

  const [modalVisible, setModalVisible] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // Toast helper wrapped with useCallback to avoid re-creation
  const showToast = useCallback(
    (message, duration = ToastAndroid.SHORT) =>
      ToastAndroid.show(message, duration),
    []
  );

  // Capitalize helper - memoized to prevent recreation
  const capitalize = useCallback(
    (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : ""),
    []
  );

  // Memoize menuItems since it depends only on router
  const renderedMenuItems = useMemo(
    () => menuItems(router, Linking, ToastAndroid, Colors),
    [router]
  );

  // --- Refresh Profile ---
  const refreshData = useCallback(async () => {
    if (fetchingRef.current || !email) return;

    setRefreshing(true);
    fetchingRef.current = true;

    try {
      const firestore = getFirestore();
      const snap = await getDoc(doc(firestore, "users", email));
      if (snap.exists()) {
        setUserDetail(snap.data());
        showToast("Profile refreshed");
      } else {
        showToast("Your data not found");
      }
    } catch (err) {
      Sentry.captureException(err);
      showToast("Failed to refresh profile");
    } finally {
      setRefreshing(false);
      fetchingRef.current = false;
    }
  }, [email, setUserDetail, showToast]);

  // Redirect if no user, else refresh profile once on mount
  useEffect(() => {
    if (!email) {
      router.replace("/auth/signIn");
    } else {
      refreshData();
    }
  }, [email, router, refreshData]);

  // --- Logout ---
  const handleLogout = useCallback(() => {
    console.log("handle logout")
    Alert.alert("Logout?", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await signOut(auth);
            await AsyncStorage.removeItem("userDetail");
            console.log("async storage removed")
            setUserDetail(null);
            router.push("/auth/signIn");
            showToast("Logged out successfully");
          } catch (error) {
            Sentry.captureException(error);
            showToast("Logout failed");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }, [auth, router, setUserDetail, showToast]);

  // --- Delete Account ---
  const confirmDeleteAccount = useCallback(
    () => setShowPasswordModal(true),
    []
  );

  const handleDeleteAccount = useCallback(async () => {
    if (!password) return;

    try {
      const user = auth.currentUser;
      const firestore = getFirestore();
      if (!user?.email) return showToast("No user currently logged in");

      setLoading(true);
      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);

      const userDocRef = doc(firestore, "users", user.email);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const deletedRef = doc(
          firestore,
          "deletedAccounts",
          user.email + user.uid
        );
        await setDoc(deletedRef, {
          ...userSnap.data(),
          email: user.email,
          deletedAt: new Date(),
        });
        await deleteDoc(userDocRef);
      }

      await deleteUser(user);
      await AsyncStorage.removeItem("userDetail");
      setUserDetail(null);
      setShowPasswordModal(false);
      setPassword("");
      showToast("Account deleted successfully");
      router.push("/");
    } catch (err) {
      Sentry.captureException(err);
      if (
        ["auth/wrong-password", "auth/invalid-credential"].includes(err.code)
      ) {
        showToast("Incorrect password");
      } else {
        showToast("Failed to delete account");
      }
    } finally {
      setLoading(false);
    }
  }, [auth, password, router, setUserDetail, showToast]);

  // --- Send Email Verification ---
  const verify = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setModalVisible({
        visible: true,
        title: "No User Found",
        message: "No user is currently signed in from profile.",
      });
      return;
    }

    try {
      await sendEmailVerification(user);
      setModalVisible({
        visible: true,
        title: "Email Verification Sent",
        message: `We've sent a verification email to ${user.email}! Check your inbox.`,
      });
    } catch (err) {
      Sentry.captureException(err);
      const tooMany = err.code === "auth/too-many-requests";
      setModalVisible({
        visible: true,
        title: tooMany ? "Too Many Attempts" : "Verification Failed",
        message: tooMany
          ? "We’ve temporarily blocked requests due to unusual activity."
          : "Please try again later.",
      });
    }
  }, [auth]);

  // --- Subscription Handler ---
  const subscribe = useCallback(() => {
    if (member === true) {
      showToast("You are already a member.");
    } else {
      router.push("/subscription");
    }
  }, [member, router, showToast]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {auth.currentUser?.emailVerified && (
          <Text style={[styles.profileEmail, { color: Colors.GREEN }]}>
            Email Verified
          </Text>
        )}

        <Image
          style={[
            styles.avatar,
            { borderColor: member ? Colors.GREEN : Colors.PRIMARY },
          ]}
          source={
            ["github.com", "google.com"].includes(provider)
              ? { uri: profilePicture }
              : require("../../assets/images/logo.png")
          }
        />

        {/* User Info */}
        {userDetail && (
          <>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text numberOfLines={1} style={styles.profileName}>
                {fullname}
              </Text>
              {member && (
                <Ionicons
                  color={Colors.GREEN}
                  size={20}
                  name="checkmark-circle"
                />
              )}
            </View>

            <Text numberOfLines={1} style={styles.profileEmail}>
              {email}
            </Text>

            {!auth.currentUser?.emailVerified && (
              <TouchableOpacity onPress={verify}>
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

            {/* Plan Button */}
            <TouchableOpacity
              onPress={subscribe}
              disabled={loading}
              style={styles.planStatus}
              accessibilityLabel="Subscribe to a plan"
              accessibilityHint="Opens subscription page"
            >
              {loading ? (
                <ActivityIndicator color={Colors.GREEN} size="small" />
              ) : (
                <Text
                  style={{
                    color: isFreeUser ? Colors.RED : Colors.GREEN,
                    textDecorationLine: isFreeUser ? "underline" : "none",
                    fontFamily: "outfit-bold",
                  }}
                >
                  {planType ? `${capitalize(planType)} Plan` : "Free Plan"}
                </Text>
              )}
            </TouchableOpacity>

            {planType && memberUntil && (
              <Text style={styles.expiryText}>
                Your plan will expire on{" "}
                {new Date(memberUntil).toLocaleDateString()}
              </Text>
            )}
          </>
        )}
      </View>

      {/* Scroll Menu */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
      >
        <View style={styles.menuSection}>
          {renderedMenuItems.map((item) => (
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

          {isFreeUser && (
            <TouchableOpacity
              style={[styles.menuItem, { marginTop: 5 }]}
              onPress={subscribe}
              disabled={loading}
            >
              <SimpleLineIcons
                name="paypal"
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
                console.error("URL open failed:", err);
                showToast("Failed to open Google Play");
              })
            }
          >
            <Entypo
              name="google-play"
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
            onPress={() =>
              auth.currentUser?.emailVerified
                ? router.push("/download")
                : showToast(
                    "Please verify your email to access downloads.",
                    ToastAndroid.LONG
                  )
            }
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
            <Text
              style={[
                styles.menuLabel,
                { color: Colors.RED, fontFamily: "outfit-bold" },
              ]}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>
          App Version {Constants.expoConfig?.version ?? "N/A"}
        </Text>
      </ScrollView>

      {/* Confirm Password Modal */}
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
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.GRAY }]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: Colors.RED, opacity: !password ? 0.5 : 1 },
                ]}
                onPress={handleDeleteAccount}
                disabled={!password || loading}
              >
                {loading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AppModal
        visible={modalVisible.visible}
        title={modalVisible.title}
        message={modalVisible.message}
        confirmText="OK"
        showCancel={false}
        onConfirm={() =>
          setModalVisible((prev) => ({ ...prev, visible: false }))
        }
      />
    </SafeAreaView>
  );
}
