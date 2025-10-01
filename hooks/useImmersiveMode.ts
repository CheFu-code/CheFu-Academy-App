import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { AppState, Platform, Dimensions } from "react-native";
import ImmersiveMode from "react-native-immersive-mode";

// Reusable hook for sticky immersive mode (insists no matter what)
export function useImmersiveMode() {
    const enableImmersive = useCallback(() => {
        if (Platform.OS === "android") {
            // "FullSticky" hides both status + nav bar and keeps them hidden
            ImmersiveMode.setBarMode("FullSticky");
        }
    }, []);

    useEffect(() => {
        // Initial apply
        enableImmersive();

        // Re-apply on app resume
        const appSub = AppState.addEventListener("change", (state) => {
            if (state === "active") enableImmersive();
        });

        // Re-apply on orientation / dimension change
        const dimSub = Dimensions.addEventListener("change", () => {
            enableImmersive();
        });

        // Safety net: periodically re-apply every 5s
        const interval = setInterval(() => {
            enableImmersive();
        }, 5000);

        return () => {
            appSub.remove();
            dimSub.remove();
            clearInterval(interval);
        };
    }, [enableImmersive]);

    // Re-apply on screen focus
    useFocusEffect(
        useCallback(() => {
            enableImmersive();
        }, [enableImmersive])
    );
}