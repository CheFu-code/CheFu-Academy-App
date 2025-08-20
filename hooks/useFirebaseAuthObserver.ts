import { getApp } from "@react-native-firebase/app";
import {
    FirebaseAuthTypes,
    getAuth,
    onAuthStateChanged,
} from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export function useFirebaseAuthObserver(authChecked: boolean, authSuccess: boolean) {
    const [userDetail, setUserDetail] = useState<FirebaseAuthTypes.User | null>(null);
    const router = useRouter();
    const alreadyRedirected = useRef(false);

    useEffect(() => {
        if (!authChecked || !authSuccess) return;

        const auth = getAuth(getApp());
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserDetail(user);
            if (!user && !alreadyRedirected.current) {
                alreadyRedirected.current = true;
                console.log("User is not authenticated, redirecting to welcome screen");
                router.replace("/");
            }
        });

        return unsubscribe;
    }, [authChecked, authSuccess, router]);

    return { userDetail, setUserDetail };
}