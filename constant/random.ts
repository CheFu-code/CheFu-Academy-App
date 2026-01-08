import { IoniconsName } from '@/types';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from './Colors';
import {
    BIOMETRICS,
    CACHE_KEY,
    CACHED_COURSES,
    DAILY_NOTIFICATION,
    OFFLINE_DOWNLOADS,
    PREF_KEY,
    SEEN_WELCOME,
    STORAGE_KEY,
    USER_DETAIL,
} from './caches';

export const SHARE_MESSAGE = 'Check out CheFu Academy App!';
export const SHARE_URL =
    'https://play.google.com/store/apps/details?id=com.chefu.academy';
export const API_BASE = 'https://chefu-academy-tmzx.onrender.com';
export const options = ['Report a bug']; // when i add more options i should uncomment out these styles on the styles file
export const COPYRIGHT = `© ${new Date().getFullYear()} CheFu Inc. All rights reserved.`;
export const REWARDED_AD_UNIT_ID = 'ca-app-pub-8952058057579255/8646813913';
export const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-8952058057579255/6615319669';
export const support = 'chefu.inc@gmail.com';
export const LAST_UPDATED = new Date(2025, 6, 10); // July is month 6 (0-indexed)
export const MAX_WORDS = 60;
export const ACTION_WIDTH = moderateScale(70);
export const categories = [
    'Tip',
    'Question',
    'Project',
    'Resource',
    'Achievement',
    'Discussion',
];

export const modalOptions: {
    label: string;
    icon: IoniconsName;
    color?: string;
}[] = [
    { label: 'Add Course', icon: 'add-circle-outline' },
    { label: 'Post Spark', icon: 'add' },
    { label: 'Favorite Videos', icon: 'heart' },
    { label: 'Contact Support', icon: 'mail-outline' },
    { label: 'Rate our app', icon: 'star-outline', color: Colors.YELLOW },
];

export const permissionDisplayNames = {
    camera: 'Camera',
    mediaLibrary: 'Media Library',
    location: 'Location',
    notifications: 'Notifications',
};

export const LOGOUT_KEYS = [
    USER_DETAIL,
    CACHE_KEY,
    BIOMETRICS,
    PREF_KEY,
    STORAGE_KEY,
    SEEN_WELCOME,
    CACHED_COURSES,
    OFFLINE_DOWNLOADS,
    DAILY_NOTIFICATION,
];
