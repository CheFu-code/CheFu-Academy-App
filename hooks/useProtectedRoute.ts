import { SEEN_WELCOME } from "@/constant/caches";
import { UserDetail } from "@/types/UserDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useSafeNavigation } from "./useSafeNavigation";

const useProtectedRoute = (
    userDetail: UserDetail | null | undefined,
    authChecked: boolean,
) => {
    const segments = useSegments();
    const { safeReplace } = useSafeNavigation();
    const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(SEEN_WELCOME).then(value => {
            setHasSeenWelcome(value === "true");
        });
    }, []);

    useEffect(() => {
        if (!authChecked) return;
        if (userDetail === undefined) return; // still resolving auth
        if (hasSeenWelcome === null) return; // still resolving storage

        const first = segments?.[0];
        const inAuthGroup = first === "auth";

        // Case 1: logged in but stuck in auth → go home
        if (userDetail && inAuthGroup) {
            console.log("ProtectedRoute → Case 1: userDetail present, inAuthGroup =", inAuthGroup);
            safeReplace("/(tabs)/home");
            return;
        }

        // Case 2: not logged in, hasn't seen onboarding → show onboarding
        if (!userDetail && !hasSeenWelcome && !inAuthGroup) {
            console.log("ProtectedRoute → Case 2: userDetail =", userDetail, "hasSeenWelcome =", hasSeenWelcome, "inAuthGroup =", inAuthGroup);
            safeReplace("/"); // or wherever your onboarding lives
            return;
        }

        // Case 3: not logged in, already seen onboarding → go sign in
        if (!userDetail && hasSeenWelcome && !inAuthGroup) {
            console.log("ProtectedRoute → Case 3: userDetail =", userDetail, "hasSeenWelcome =", hasSeenWelcome, "inAuthGroup =", inAuthGroup);
            safeReplace("/auth/signIn");
        }

    }, [authChecked, userDetail, segments, safeReplace, hasSeenWelcome]);
};

export default useProtectedRoute;
