import { auth, db } from "@/config/fireConfig";
import { showToast } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, signOut } from "@react-native-firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useCallback, useState } from "react";
import { ToastAndroid } from "react-native";


export function useProfileActions(userDetail: any, setUserDetail: any, router: any) {
    const CACHE_KEY = "@cached_courses";
    const [loading, setLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            await signOut(auth);
            await AsyncStorage.removeItem("userDetail");
            await AsyncStorage.removeItem(CACHE_KEY);
            setUserDetail(null);
            ToastAndroid.show("Logout successfully", ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show("Failed to logout", ToastAndroid.SHORT);
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    }, [setUserDetail]);

    const handleDeleteAccount = useCallback(async (password: string) => {
        if (!password) return;
        try {
            setLoading(true);
            const user = auth.currentUser;
            if (!user?.email) return ToastAndroid.show("No user logged in", ToastAndroid.SHORT);

            const cred = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, cred);

            const userDocRef = doc(db, "users", user.email);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const deletedRef = doc(db, "deletedAccounts", user.email + user.uid);
                await setDoc(deletedRef, { ...userSnap.data(), email: user.email, deletedAt: new Date() });
                await deleteDoc(userDocRef);
            }

            await deleteUser(user);
            await AsyncStorage.removeItem("userDetail");
            setUserDetail(null);
            ToastAndroid.show("Account deleted successfully", ToastAndroid.SHORT);
            router.push("/");
        } catch (err: unknown) {
            Sentry.captureException(err);

            const errorCode = (err as { code?: string }).code;

            if (
                errorCode === "auth/wrong-password" ||
                errorCode === "auth/invalid-credential"
            ) {
                showToast("Incorrect password");
            } else {
                showToast("Failed to delete account");
            }
        } finally {
            setLoading(false);
        }
    }, [router, setUserDetail]);


    const verifyEmail = useCallback(async () => {
        try {
            setLoading(true);
            const user = auth.currentUser;
            if (!user) return ToastAndroid.show("No user signed in", ToastAndroid.SHORT);
            await sendEmailVerification(user);
            ToastAndroid.show(`Verification email sent to ${user.email}`, ToastAndroid.LONG);
            setLoading(false);
        } catch (err) {
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, handleLogout, handleDeleteAccount, verifyEmail };
}
