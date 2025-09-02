import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface User {
    id: string;
    email: string;
    fullname?: string;
    profilePicture?: string;
    bio?: string;
    country?: string;
    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
    fcmToken?: string;
    isVerified: boolean;
    language: string;
    lastLogin: FirebaseFirestoreTypes.Timestamp;
    lastSeen: FirebaseFirestoreTypes.Timestamp;
    member: boolean;
    onboardingComplete: boolean;
    provider: string;
    roles: string[];
    subscriptionStatus: string;
    uid: string;
    emailPreferences: {
        activity: boolean;
        general: boolean;
        marketing: boolean;
        security: boolean;
    };
    deviceInfo: {
        deviceBrand: string;
        deviceModel: string;
        deviceName: string;
        isRTL: boolean;
        isTablet: boolean;
        manufacturer: string;
        orientation: string;
        os: string;
        osVersion: number;
        screenHeight: number;
        screenWidth: number;
        totalMemory: number;
    };
}


export interface UserDropdownProps {
    user: User | null;
}
