import { db } from '@/config/firebaseConfig';
import { UserDetail } from '@/types/UserDetail';
import { doc, getDoc } from '@react-native-firebase/firestore';

export type UserProfileSummary = Partial<
    Pick<UserDetail, 'email' | 'fullname' | 'isVerified' | 'profilePicture' | 'uid'>
> & {
    id: string;
};

const profileCache = new Map<string, Promise<UserProfileSummary | null>>();

export function getUserProfileSummary(
    userId: string,
): Promise<UserProfileSummary | null> {
    const key = userId.trim();
    if (!key) return Promise.resolve(null);

    const cached = profileCache.get(key);
    if (cached) return cached;

    const request = getDoc(doc(db, 'users', key))
        .then((snapshot) => {
            if (!snapshot.exists()) return null;

            return sanitizeUserProfileSummary(snapshot.id, snapshot.data());
        })
        .catch((error) => {
            profileCache.delete(key);
            throw error;
        });

    profileCache.set(key, request);
    return request;
}

function sanitizeUserProfileSummary(
    id: string,
    raw: unknown,
): UserProfileSummary | null {
    if (!raw || typeof raw !== 'object') return null;

    const data = raw as Partial<UserDetail>;
    const profile: UserProfileSummary = { id };

    if (typeof data.email === 'string') profile.email = data.email;
    if (typeof data.fullname === 'string') profile.fullname = data.fullname;
    if (typeof data.profilePicture === 'string') {
        profile.profilePicture = data.profilePicture;
    }
    if (typeof data.uid === 'string') profile.uid = data.uid;
    if (typeof data.isVerified === 'boolean') {
        profile.isVerified = data.isVerified;
    }

    return profile;
}

export function clearUserProfileSummaryCache(userId?: string) {
    if (userId) {
        profileCache.delete(userId.trim());
        return;
    }

    profileCache.clear();
}
