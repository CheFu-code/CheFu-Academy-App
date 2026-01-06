import { auth, db, user } from '@/config/firebaseConfig';
import { LOGOUT_KEYS } from '@/constant/random';
import { UserDetail } from '@/types/UserDetail';
import { showToast } from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    sendEmailVerification,
    signOut,
} from '@react-native-firebase/auth';
import {
    deleteDoc,
    doc,
    getDoc,
    setDoc,
} from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useProfileActions(
    userDetail: UserDetail | null,
    setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>,
    router: any,
) {
    const [loading, setLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            await signOut(auth);
            await AsyncStorage.multiRemove(LOGOUT_KEYS);
            setUserDetail(null);
        } catch (err) {
            showToast('Failed to logout');
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    }, [setUserDetail]);

    const handleDeleteAccount = useCallback(
        async (password: string) => {
            if (!password) return;
            try {
                setLoading(true);
                if (!user?.email) return showToast('No user logged in');

                const cred = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, cred);

                const userDocRef = doc(db, 'users', user.email);
                const userSnap = await getDoc(userDocRef);

                if (userSnap.exists()) {
                    const deletedRef = doc(
                        db,
                        'deletedAccounts',
                        user.email + user.uid,
                    );
                    await setDoc(deletedRef, {
                        ...userSnap.data(),
                        email: user.email,
                        deletedAt: new Date(),
                    });
                    await deleteDoc(userDocRef);
                }

                await deleteUser(user);
                await AsyncStorage.multiRemove(LOGOUT_KEYS);
                setUserDetail(null);
                showToast('Account deleted successfully');
                router.replace('/');
            } catch (err: unknown) {
                Sentry.captureException(err);

                const errorCode = (err as { code?: string }).code;

                if (
                    errorCode === 'auth/wrong-password' ||
                    errorCode === 'auth/invalid-credential'
                ) {
                    showToast('Incorrect password');
                } else {
                    showToast('Failed to delete account');
                }
            } finally {
                setLoading(false);
            }
        },
        [router, setUserDetail],
    );

    const verifyEmail = useCallback(async () => {
        try {
            setLoading(true);
            if (!user) return showToast('No user signed in');
            await sendEmailVerification(user);
            Alert.alert(`Verification email sent to ${user?.email}`);
            setLoading(false);
        } catch (err) {
            showToast('Error. Please try again');
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, handleLogout, handleDeleteAccount, verifyEmail };
}
