import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useBiometricAuth() {
    const [authChecked, setAuthChecked] = useState(false);
    const [authSuccess, setAuthSuccess] = useState(false);

    useEffect(() => {
        const checkBiometrics = async () => {
            try {
                const biometricEnabled = await AsyncStorage.getItem("useBiometrics");
                if (biometricEnabled !== "true") {
                    setAuthSuccess(true);
                    return;
                }

                const hasHardware = await LocalAuthentication.hasHardwareAsync();
                const isEnrolled = await LocalAuthentication.isEnrolledAsync();

                if (!hasHardware || !isEnrolled) {
                    Alert.alert(
                        "Biometric unavailable",
                        "Your device does not support biometric authentication."
                    );
                    setAuthSuccess(true);
                    return;
                }

                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Unlock CheFu Academy",
                    fallbackLabel: "Use device PIN",
                    cancelLabel: "Cancel",
                });

                setAuthSuccess(result.success);
            } catch (error: unknown) {
                Sentry.captureException(error instanceof Error ? error : new Error("Unknown biometric error"));
                setAuthSuccess(true); // Default to success to avoid locking out user
            } finally {
                setAuthChecked(true);
            }
        };

        checkBiometrics();
    }, []);

    return { authChecked, authSuccess };
}