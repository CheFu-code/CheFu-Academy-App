import { UserDetail } from "@/types/UserDetail";
import { useSegments } from "expo-router";
import { useSafeNavigation } from "./useSafeNavigation";
import { useEffect } from "react";

const useProtectedRoute = (
    userDetail: UserDetail | null | undefined,
    authChecked: boolean,
) => {
    const segments = useSegments();
    const { safeReplace } = useSafeNavigation();

    useEffect(() => {
        if (!authChecked) return;
        if (userDetail === undefined) return; // still resolving auth

        const first = segments?.[0];
        const inAuthGroup = first === 'auth';

        // Avoid repeated replaces when already in the right place
        if (userDetail && inAuthGroup) {
            safeReplace('/(tabs)/home');
            return;
        }
        if (!userDetail && !inAuthGroup) {
            // safeReplace('/auth/signIn');
            safeReplace('/');
        }
    }, [authChecked, userDetail, segments, safeReplace]);
};

export default useProtectedRoute;