import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useBiometricAuth() {
    const [authChecked, setAuthChecked] = useState(false);
    const [authSuccess, setAuthSuccess] = useState(false);

    const runBiometrics = async () => {
        try {
            const biometricEnabled = await AsyncStorage.getItem("useBiometrics");
            if (biometricEnabled !== "true") {
                setAuthSuccess(true);
            } else {
                const hasHardware = await LocalAuthentication.hasHardwareAsync();
                const isEnrolled = await LocalAuthentication.isEnrolledAsync();

                if (!hasHardware || !isEnrolled) {
                    Alert.alert(
                        "Biometric unavailable",
                        "Your device does not support biometric authentication."
                    );
                    setAuthSuccess(true);
                } else {
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: "Unlock CheFu Academy",
                        fallbackLabel: "Use device PIN",
                        cancelLabel: "Cancel",
                    });
                    setAuthSuccess(result.success);
                }
            }
        } catch (error) {
            Sentry.captureException(error);
            setAuthSuccess(true);
        } finally {
            setAuthChecked(true); // ✅ always set
        }
    };


    useEffect(() => {
        runBiometrics(); // first run on startup
    }, []);

    return { authChecked, authSuccess, retryAuth: runBiometrics };
}
