// biometrics.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export async function checkBiometrics(): Promise<boolean> {
    try {
        const biometricEnabled = await AsyncStorage.getItem("useBiometrics");
        if (biometricEnabled !== "true") {
            return true; // Skip if biometrics not enabled
        }

        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            Alert.alert(
                "Biometric unavailable",
                "Your device does not support biometric authentication."
            );
            return true; // Default to success
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Unlock CheFu Academy",
            fallbackLabel: "Use device PIN",
            cancelLabel: "Cancel",
        });

        return result.success;
    } catch (error: unknown) {
        Sentry.captureException(error instanceof Error ? error : new Error("Unknown biometric error"));
        return true; // Default to success
    }
}
