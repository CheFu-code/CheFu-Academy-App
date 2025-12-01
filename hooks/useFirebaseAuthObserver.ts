import { UserDetail } from "@/types/UserDetail";
import { getApp } from "@react-native-firebase/app";
import {
    FirebaseAuthTypes,
    getAuth,
    onAuthStateChanged,
} from "@react-native-firebase/auth";
import { Timestamp } from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSafeNavigation } from "./useSafeNavigation";

// 🔹 Map Firebase User → UserDetail
function mapFirebaseUserToUserDetail(user: FirebaseAuthTypes.User): UserDetail {
    const now = Timestamp.now();
    return {
        id: user.uid,
        uid: user.uid,
        email: user.email ?? "",
        fullname: user.displayName ?? "",
        profilePicture: user.photoURL ?? "",
        bio: "",
        country: "",
        createdAt: now,
        updatedAt: now,
        fcmToken: "",
        isVerified: user.emailVerified,
        language: "en",
        lastLogin: now,
        lastSeen: now,
        member: false,
        onboardingComplete: false,
        provider: user.providerId ?? "firebase",
        roles: ["user"],
        subscriptionStatus: "free",
        emailPreferences: {
            activity: true,
            general: true,
            marketing: false,
            security: true,
        },
        deviceInfo: {
            deviceBrand: "",
            deviceModel: "",
            deviceName: "",
            isRTL: false,
            isTablet: false,
            manufacturer: "",
            orientation: "portrait",
            os: "",
            osVersion: 0,
            screenHeight: 0,
            screenWidth: 0,
            totalMemory: 0,
        },
    };
}

export function useFirebaseAuthObserver(authChecked: boolean, authSuccess: boolean) {
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const { safeReplace } = useSafeNavigation()
    const alreadyRedirected = useRef(false);

    useEffect(() => {
        if (!authChecked || !authSuccess) return;

        const auth = getAuth(getApp());
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const mappedUser = mapFirebaseUserToUserDetail(user);
                setUserDetail(mappedUser);
            } else {
                setUserDetail(null);
                if (!alreadyRedirected.current) {
                    alreadyRedirected.current = true;
                    console.log("User is not authenticated, redirecting to sign in screen");
                    safeReplace("/auth/signIn");
                }
            }
        });

        return unsubscribe;
    }, [authChecked, authSuccess, safeReplace]);

    return { userDetail, setUserDetail };
}