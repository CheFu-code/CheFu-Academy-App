import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useContext, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppModal from "../../component/Shared/AppModal";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/SignUp.styles";
import { signUpUser } from "../../utils/authService";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

interface SignUpResponse {
    user: FirebaseAuthTypes.User;
    userData: {
        fullname?: string;
        lastLogin?: Date;
        updatedAt?: Date;
        profilePicture?: string | null;
        provider?: string;
        [key: string]: unknown;
    };
}

type SignUpResponseOrUndefined = SignUpResponse | undefined;

const SignUp = () => {
    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUserDetail } = useContext(UserDetailContext);
    const { safeReplace, safePush } = useSafeNavigation()
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (pw: string) => pw.length >= 6;
    const [successModal, setSuccessModal] = useState({
        visible: false,
        title: "",
        message: "",
    });

    const handleSignUp = async () => {
        if (loading) return;
        setErrorMsg("");

        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setErrorMsg("All fields are required.");
            return;
        }
        if (!validateEmail(email.trim())) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }
        if (!validatePassword(password)) {
            setErrorMsg("Password should be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const response: SignUpResponseOrUndefined = await signUpUser(
                fullName,
                email,
                password
            );

            if (!response) {
                setErrorMsg("Sign up failed. Please try again.");
                return;
            }

            const { userData } = response;
            setUserDetail(userData);
            setErrorMsg("");
            setSuccessModal({
                visible: true,
                title: "Account created successfully",
                message:
                    "Please check your inbox to verify your email address — and if it’s not there, don’t forget to look in your spam folder.",
            });
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateFullName = (name: string) => {
        const isValid = /^[a-zA-Z\s-]{1,20}$/.test(name.trim());
        setFullNameError(!isValid);
        return isValid;
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
                        <Text style={styles.modalTitle}>
                            Creating your account...
                        </Text>
                        <Text style={styles.modalSubtext}>
                            Just a moment while we create your account.
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={30}
                >
                    <View style={{ alignItems: "center", padding: 10 }}>
                        <Image
                            source={require("./../../assets/images/logo.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Create new account</Text>
                    </View>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "center",
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ alignItems: "center", padding: 10 }}>
                            <TextInput
                                placeholder="Fullname"
                                style={[
                                    styles.textInput,
                                    fullNameError && { borderColor: "red" },
                                ]}
                                placeholderTextColor={Colors.GRAY}
                                onChangeText={(v) => {
                                    const clean = v
                                        .replace(/[^a-zA-Z\s-]/g, "")
                                        .slice(0, 20);
                                    setFullName(clean);
                                    validateFullName(clean);
                                }}
                                onBlur={() => validateFullName(fullName)}
                                maxLength={20}
                                value={fullName}
                                accessibilityLabel="Full Name"
                                autoCapitalize="words"
                                returnKeyType="next"
                            />
                            {fullNameError && (
                                <Text
                                    style={{
                                        color: "red",
                                        marginTop: 4,
                                        fontFamily: "outfit",
                                    }}
                                >
                                    Name must be 1–20 letters only 'A–Z, spaces,
                                    hyphens(optional)'.
                                </Text>
                            )}

                            <TextInput
                                placeholder="Email"
                                style={styles.textInput}
                                placeholderTextColor={Colors.GRAY}
                                onChangeText={(v) => setEmail(v.trim())}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                maxLength={100}
                                value={email}
                                accessibilityLabel="Email Address"
                                returnKeyType="next"
                            />
                            <View
                                style={{ width: "100%", position: "relative" }}
                            >
                                <TextInput
                                    placeholder="Password"
                                    style={styles.textInput}
                                    placeholderTextColor={Colors.GRAY}
                                    secureTextEntry={!showPassword}
                                    onChangeText={(v) => setPassword(v)}
                                    maxLength={50}
                                    value={password}
                                    accessibilityLabel="Password"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        if (!loading) handleSignUp();
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        position: "absolute",
                                        right: 15,
                                        top: 32,
                                    }}
                                    accessibilityLabel={
                                        showPassword
                                            ? "Hide Password"
                                            : "Show Password"
                                    }
                                    accessibilityRole="button"
                                >
                                    <Text
                                        style={[
                                            styles.showPassword,
                                            {
                                                color:
                                                    showPassword === true
                                                        ? Colors.GREEN
                                                        : Colors.PRIMARY,
                                            },
                                        ]}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {errorMsg ? (
                                <Text
                                    style={{
                                        color: "red",
                                        marginTop: 10,
                                        textAlign: "center",
                                    }}
                                    accessibilityLiveRegion="polite"
                                >
                                    {errorMsg}
                                </Text>
                            ) : null}

                            <TouchableOpacity
                                onPress={handleSignUp}
                                style={[
                                    styles.button,
                                    {
                                        opacity:
                                            loading ||
                                                !email ||
                                                !password ||
                                                !fullName
                                                ? 0.4
                                                : 1,
                                    },
                                ]}
                                disabled={
                                    loading || !email || !password || !fullName
                                }
                            >
                                {!loading ? (
                                    <Text style={styles.buttonText}>
                                        Create Account
                                    </Text>
                                ) : (
                                    <ActivityIndicator
                                        color={"white"}
                                        size={"large"}
                                    />
                                )}
                            </TouchableOpacity>

                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 3,
                                    marginTop: 20,
                                }}
                            >
                                <Text style={{ color: Colors.WHITE }}>
                                    Already have an account?{" "}
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        safeReplace("/auth/signIn")
                                    }
                                >
                                    <Text
                                        style={{
                                            color: Colors.PRIMARY,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Sign In
                                    </Text>
                                </Pressable>
                            </View>

                            <Pressable disabled={loading}>
                                <Text style={styles.conditions}>
                                    By signing up, you agree to our{" "}
                                    <Text
                                        style={{
                                            color: Colors.YELLOW,
                                            textDecorationLine: "underline",
                                        }}
                                        onPress={() => safePush("/terms")}
                                    >
                                        Terms of Service
                                    </Text>{" "}
                                    and{" "}
                                    <Text
                                        style={{
                                            color: Colors.YELLOW,
                                            textDecorationLine: "underline",
                                        }}
                                        onPress={() => safePush("/privacy")}
                                    >
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <AppModal
                visible={successModal.visible}
                title={successModal.title}
                message={successModal.message}
                confirmText="OK"
                showCancel={false}
                onCancel={() => {
                    setSuccessModal({ ...successModal, visible: false });
                }}
                onConfirm={() => {
                    setSuccessModal({ ...successModal, visible: false });
                    safeReplace("/(tabs)/home");
                }}
            />
        </>
    );
};

export default SignUp;
