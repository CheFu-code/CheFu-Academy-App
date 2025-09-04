import { Timestamp } from "firebase/firestore";

export interface User {
    id: string;
    email: string;
    fullname?: string;
    profilePicture?: string;
    bio?: string;
    country?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    fcmToken?: string;
    isVerified: boolean;
    language: string;
    lastLogin: Timestamp;
    lastSeen: Timestamp;
    member: boolean;
    onboardingComplete: boolean;
    provider: string;
    roles: string[];
    subscriptionStatus: string;
    uid: string;
    memberUntil?: Timestamp;
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
