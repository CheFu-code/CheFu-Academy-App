// services/userService.ts
import {
    deleteUser,
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    sendEmailVerification,
} from "@react-native-firebase/auth";
import {
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    setDoc,
} from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useCallback, useState } from "react";

export async function fetchUser(email: string) {
    const firestore = getFirestore();
    return getDoc(doc(firestore, "users", email));
}

export async function deleteAccount(user: any, password: string) {
    const auth = getAuth();
    const firestore = getFirestore();

    const cred = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, cred);

    const userDocRef = doc(firestore, "users", user.email);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
        const deletedRef = doc(firestore, "deletedAccounts", user.email + user.uid);
        await setDoc(deletedRef, {
            ...userSnap.data(),
            email: user.email,
            deletedAt: new Date(),
        });
        await deleteDoc(userDocRef);
    }

    await deleteUser(user);
}

export async function sendVerificationEmail(user: any) {
    return sendEmailVerification(user);
}
const auth = getAuth();

export const verify = useCallback(async () => {
    const user = auth.currentUser;
    const [modalVisible, setModalVisible] = useState({
        visible: false,
        title: "",
        message: "",
    });
    if (!user) {
        setModalVisible({
            visible: true,
            title: "No User Found",
            message: "No user is currently signed in from profile.",
        });
        return;
    }

    try {
        await sendEmailVerification(user);
        setModalVisible({
            visible: true,
            title: "Email Verification Sent",
            message: `We've sent a verification email to ${user.email}! Check your inbox.`,
        });
    } catch (err: unknown) {
        Sentry.captureException(err);
        const tooMany = (err as any).code === "auth/too-many-requests";
        setModalVisible({
            visible: true,
            title: tooMany ? "Too Many Attempts" : "Verification Failed",
            message: tooMany
                ? "We’ve temporarily blocked requests due to unusual activity."
                : "Please try again later.",
        });
    }
}, [auth]);