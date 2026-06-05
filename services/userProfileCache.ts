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

            return {
                ...(snapshot.data() as Partial<UserDetail>),
                id: snapshot.id,
            } satisfies UserProfileSummary;
        })
        .catch((error) => {
            profileCache.delete(key);
            throw error;
        });

    profileCache.set(key, request);
    return request;
}

export function clearUserProfileSummaryCache(userId?: string) {
    if (userId) {
        profileCache.delete(userId.trim());
        return;
    }

    profileCache.clear();
}
