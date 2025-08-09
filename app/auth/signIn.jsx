import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import * as Sentry from "@sentry/react-native";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useContext, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/SignIn.styles";

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fatalError, setFatalError] = useState(null);

    const auth = getAuth();
    const db = getFirestore();

    const SUPPORT_EMAIL = "kurisanimaluleke77@gmail.com";

    const getUserDetail = async (email) => {
        try {
            const userDocRef = doc(db, "users", email);
            // Update lastLogin to now
            await userDocRef.update({ lastLogin: new Date() });
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserDetail(userDoc.data());
            } else {
                console.warn("User data not found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching user data from sign in:", error);
            Sentry.captureException(error);
        }
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSignIn = async () => {
        if (loading) return;

        const cleanEmail = email.trim().toLowerCase();
        setEmailError("");
        setPasswordError("");

        if (!cleanEmail) {
            setEmailError("Please enter your email");
            return;
        }
        if (!validateEmail(cleanEmail)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        if (!password) {
            setPasswordError("Please enter your password");
            return;
        }

        setLoading(true);
        try {
            const resp = await auth.signInWithEmailAndPassword(
                cleanEmail,
                password
            );
            const signedInEmail = resp.user.email;

            // 🔔 1. Get FCM token
            const fcmToken = await messaging().getToken();

            if (fcmToken) {
                // 🔥 2. Save to Firestore backend (use your own endpoint)
                await fetch(
                    "https://chefu-academy-tmzx.onrender.com/api/save-fcm-token",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: signedInEmail,
                            fcmToken,
                        }),
                    }
                );
            } else {
                console.warn("⚠️ No FCM token received.");
            }

            const deviceInfo = {
                brand: Device.brand,
                modelName: Device.modelName,
                osName: Device.osName,
                osVersion: Device.osVersion,
                deviceType: Device.deviceType,
            };

            // 2. Get location info
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            let locationInfo = {};
            if (status === "granted") {
                const location = await Location.getCurrentPositionAsync({});
                locationInfo = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
            } else {
                console.warn("Location permission not granted.");
                ToastAndroid.show(
                    "Please grant location permission to protect your account.",
                    ToastAndroid.SHORT
                );
            }

            await getUserDetail(signedInEmail); // updates userDetail state

            router.replace("/(tabs)/home");
            ToastAndroid.show("Signed in successfully", ToastAndroid.SHORT);

            const userDocRef = doc(db, "users", signedInEmail);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            const previousDevices = userDoc.data()?.trustedDevices || [];

            const currentDevice = deviceInfo; // e.g. brand + model + os

            // Check if device is new
            const isNewDevice = !previousDevices.some(
                (d) =>
                    d.brand === currentDevice.brand &&
                    d.modelName === currentDevice.modelName &&
                    d.osName === currentDevice.osName &&
                    d.osVersion === currentDevice.osVersion
            );

            if (isNewDevice && userData?.emailPreferences?.security === true) {
                // Send alert email
                await fetch(
                    "https://chefu-academy-tmzx.onrender.com/api/email/send-alert",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: signedInEmail,
                            name:
                                userData?.fullname ||
                                signedInEmail.split("@")[0],
                            device: deviceInfo,
                            location: locationInfo,
                        }),
                    }
                );
                // Update trusted devices and locations
                await userDocRef.update({
                    trustedDevices: [...previousDevices, currentDevice],
                });

                console.log("alert email sent");
            } else {
                console.log("no need to send alert email");
            }
        } catch (e) {
            Sentry.captureException(e);
            const contactSupport = () =>
                Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
            switch (e.code) {
                case "auth/operation-not-allowed":
                    Alert.alert(
                        "Login Not Enabled",
                        "Email/password accounts are not enabled. Please contact support.",
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Contact Now", onPress: contactSupport },
                        ]
                    );
                    break;
                case "auth/invalid-credential":
                    ToastAndroid.show(
                        "Invalid credentials. Please try again.",
                        ToastAndroid.SHORT
                    );
                    break;
                case "auth/unknown":
                    Alert.alert(
                        "Unknown Error",
                        "We encountered an unknown error. Please try again later"
                    );
                    break;
                case "auth/network-request-failed":
                    Alert.alert(
                        "Network Error",
                        "Please check your internet connection and try again."
                    );
                    break;
                case "auth/too-many-requests":
                    Alert.alert(
                        "Error",
                        "Too many requests have been made from this device."
                    );
                    break;
                case "auth/internal-error":
                case "auth/network-request-failed":
                    Alert.alert(
                        "Error",
                        e.message || "Please try again or contact support.",
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Contact", onPress: contactSupport },
                        ]
                    );
                    break;
                default:
                    Alert.alert("Error", e.message);
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Modal animationType="fade" transparent={true} visible={loading}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <LottieView
                            source={require("./../../assets/animations/GO TO SCHOOL ANIMATION.json")}
                            autoPlay
                            loop
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={styles.modalTitle}>Signing you in...</Text>
                        <Text style={styles.modalSubtext}>
                            Just a moment while we load your profile.
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

    if (fatalError) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Colors.BG_COLOR,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "red", fontSize: 18, marginBottom: 20 }}>
                    A fatal error occurred.
                </Text>
                <Text style={{ color: "red", fontSize: 14, marginBottom: 20 }}>
                    {fatalError?.message || String(fatalError)}
                </Text>
                <TouchableOpacity
                    onPress={() => setFatalError(null)}
                    style={{
                        backgroundColor: Colors.PRIMARY,
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const gitHub = () => {
        router.push("/auth/github");
    };

    const google = () => {
        router.push("/auth/google");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={30}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={{
                            alignItems: "center",
                            paddingTop: 30,
                            padding: 25,
                        }}
                    >
                        <LottieView
                            autoPlay
                            loop={true}
                            source={require("./../../assets/animations/Login.json")}
                            style={styles.lottieView}
                        />
                        <Text style={styles.welcomeText}>Welcome back</Text>

                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            placeholderTextColor={Colors.GRAY}
                            onChangeText={(value) => {
                                setEmail(value.trim());
                                if (emailError) setEmailError("");
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {emailError ? (
                            <Text
                                style={{
                                    color: "red",
                                    alignSelf: "flex-start",
                                }}
                            >
                                {emailError}
                            </Text>
                        ) : null}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={Colors.GRAY}
                                secureTextEntry={!showPassword}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    if (passwordError) setPasswordError("");
                                }}
                                autoCapitalize="none"
                                style={styles.passwordInput}
                                onSubmitEditing={() => {
                                    if (!loading) handleSignIn();
                                }}
                            />

                            <Pressable
                                onPress={() => setShowPassword((prev) => !prev)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color={Colors.PRIMARY}
                                />
                            </Pressable>
                        </View>
                        {passwordError ? (
                            <Text
                                style={{
                                    color: "red",
                                    alignSelf: "flex-start",
                                }}
                            >
                                {passwordError}
                            </Text>
                        ) : null}

                        <Pressable
                            onPress={() => router.push("/auth/forgotPassword")}
                            style={{ alignSelf: "flex-end", marginTop: 10 }}
                        >
                            <Text
                                style={{
                                    color: Colors.PRIMARY,
                                    fontWeight: "bold",
                                }}
                            >
                                Forgot Password?
                            </Text>
                        </Pressable>

                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => gitHub()}>
                                <AntDesign
                                    style={styles.icons}
                                    size={24}
                                    color={"white"}
                                    name="github"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => google()}>
                                <AntDesign
                                    style={styles.icons}
                                    name="google"
                                    size={24}
                                    color={"white"}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.signInButonContaner,
                                {
                                    opacity:
                                        loading || !email || !password
                                            ? 0.4
                                            : 1,
                                },
                            ]}
                            onPress={handleSignIn}
                            disabled={loading || !email || !password}
                        >
                            {!loading ? (
                                <Text style={styles.signInButton}>Sign In</Text>
                            ) : (
                                <ActivityIndicator color="white" size="large" />
                            )}
                        </TouchableOpacity>

                        <View style={{ flexDirection: "row", marginTop: 20 }}>
                            <Text style={{ color: Colors.WHITE }}>
                                Don't have an account?{" "}
                            </Text>
                            <Pressable
                                onPress={() => router.replace("/auth/signUp")}
                            >
                                <Text
                                    style={{
                                        color: Colors.PRIMARY,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Sign Up
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;
