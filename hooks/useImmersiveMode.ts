import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { AppState, Platform } from "react-native";
import ImmersiveMode from "react-native-immersive";

// Reusable hook for sticky immersive mode
export function useImmersiveMode() {
    const enableImmersive = useCallback(() => {
        if (Platform.OS === "android" && ImmersiveMode?.setImmersive) {
            // Use sticky if available, fallback to standard immersive
            if (typeof ImmersiveMode.setImmersiveSticky === "function") {
                ImmersiveMode.setImmersiveSticky(true);
            } else {
                ImmersiveMode.setImmersive(true);
            }
        }
    }, []);

    // Initial mount
    useEffect(() => {
        enableImmersive();

        // Re-apply on app resume
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") enableImmersive();
        });

        return () => sub.remove();
    }, [enableImmersive]);

    // Re-apply on screen focus
    useFocusEffect(
        useCallback(() => {
            enableImmersive();
        }, [enableImmersive])
    );
}