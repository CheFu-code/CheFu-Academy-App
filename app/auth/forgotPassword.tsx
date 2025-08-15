import AppModal from "@/component/Shared/AppModal";
import { getAuth } from "@react-native-firebase/auth";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorModal from "../../component/Shared/ErrorModal";
import { Colors } from "../../constant/Colors";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const auth = getAuth();
    const [successModalVisible, setSuccessModalVisible] = useState({
        visible: false,
        title: "",
        message: "",
    });
    const [errorModalVisible, setErrorModalVisible] = useState({
        visible: false,
        title: "",
        message: "",
    });

    const handleReset = () => {
        if (loading) return;
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            setErrorModalVisible({
                visible: true,
                title: "Enter Email",
                message: "Please enter your email address.",
            });
            return;
        }

        setLoading(true);

        auth.sendPasswordResetEmail(cleanEmail)
            .then(() => {
                setLoading(false);
                setSuccessModalVisible({
                    visible: true,
                    title: "Check Your Email",
                    message: `Password reset link sent to ${cleanEmail}.`,
                });
            })
            .catch((error) => {
                setLoading(false);
                Sentry.captureException(error);

                if (!error || !error.code) {
                    setErrorModalVisible({
                        visible: true,
                        title: "Error",
                        message: "An unknown error occurred. Please try again.",
                    });
                    return;
                }
                switch (error.code) {
                    case "auth/user-not-found":
                        setErrorModalVisible({
                            visible: true,
                            title: "User Not Found",
                            message: "No user found with this email.",
                        });
                        break;
                    case "auth/invalid-email":
                        setErrorModalVisible({
                            visible: true,
                            title: "Invalid Email",
                            message: "The email address is not valid.",
                        });
                        break;
                    case "auth/missing-email":
                        setErrorModalVisible({
                            visible: true,
                            title: "Missing Email",
                            message: "Please enter your email address.",
                        });
                        break;
                    case "auth/network-request-failed":
                        setErrorModalVisible({
                            visible: true,
                            title: "Network Error",
                            message: "Please check your internet connection.",
                        });
                        break;
                    default:
                        setErrorModalVisible({
                            visible: true,
                            title: "Error",
                            message: error.message,
                        });
                }
            });
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        marginBottom: 30,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <LottieView
                        source={require("../../assets/animations/Forget password animation.json")}
                        autoPlay
                        loop
                        style={{ width: 150, height: 150 }}
                    />
                </View>
                <Text style={styles.title}>Reset Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.GRAY}
                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    disabled={loading || !email.trim()}
                    onPress={handleReset}
                    style={[
                        styles.button,
                        { opacity: loading || !email.trim() ? 0.5 : 1 },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={"white"} />
                    ) : (
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                    style={styles.cancel}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ErrorModal
                visible={errorModalVisible.visible}
                title={errorModalVisible.title}
                message={errorModalVisible.message}
                onConfirm={() =>
                    setErrorModalVisible({
                        ...errorModalVisible,
                        visible: false,
                    })
                }
            />

            <AppModal
                showCancel={false}
                onCancel={null}
                visible={successModalVisible.visible}
                title={successModalVisible.title}
                message={successModalVisible.message}
                onConfirm={() => {
                    setSuccessModalVisible({
                        ...successModalVisible,
                        visible: false,
                    });
                    router.back();
                }}
            />
        </>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: 25,
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: Colors.PRIMARY,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: Colors.WHITE,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 18,
        textAlign: "center",
    },
    cancel: {
        marginTop: 15,
    },
    cancelText: {
        color: Colors.PRIMARY,
        textAlign: "center",
    },
});
