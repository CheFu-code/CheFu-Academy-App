import { UserDetail } from "@/types/UserDetail";
import { getApp } from "@react-native-firebase/app";
import {
    FirebaseAuthTypes,
    getAuth,
    onAuthStateChanged,
} from "@react-native-firebase/auth";
import { Timestamp } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

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
    const [userDetail, setUserDetail] = useState<UserDetail | null | undefined>(undefined);

    useEffect(() => {
        if (!authChecked || !authSuccess) return;

        const auth = getAuth(getApp());
        // On subscribe, mark as "loading" again to avoid stale null from previous runs
        setUserDetail(undefined);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserDetail(mapFirebaseUserToUserDetail(user));
            } else {
                setUserDetail(null); // definitively signed out
            }
        });

        return unsubscribe;
    }, [authChecked, authSuccess]);

    return { userDetail, setUserDetail };
}
