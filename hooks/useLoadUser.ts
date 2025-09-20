// hooks/useLoadUser.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Platform, ToastAndroid } from "react-native";
import { UserDetailContext } from "../context/UserDetailContext";
import { useSafeNavigation } from "./useSafeNavigation";

export const useLoadUser = () => {
    const { safeReplace } = useSafeNavigation()
    const { setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const firestore = getFirestore();

        const isErrorWithCode = (e: unknown): e is { code: string; message?: string } =>
            typeof e === "object" && e !== null && "code" in e && typeof (e as any).code === "string";

        const getErrorMessage = (e: unknown) =>
            e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);

        async function loadUser() {
            try {
                const storedUser = await AsyncStorage.getItem("userDetail");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUserDetail(userData);
                    setLoading(false);
                    safeReplace("/(tabs)/home");
                    return;
                }

                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        setLoading(false);
                        return;
                    }

                    try {
                        await user.reload();

                        if (!user.email) return setLoading(false);

                        const userRef = doc(firestore, "users", user.email);
                        const result = await getDoc(userRef);

                        if (result.exists()) {
                            const userData = result.data();
                            if (!userData) return setLoading(false);

                            if (user.emailVerified && !userData.isVerified) {
                                await updateDoc(userRef, { isVerified: true, updatedAt: new Date() });
                                userData.isVerified = true;
                            }

                            setUserDetail(userData);
                            await AsyncStorage.setItem("userDetail", JSON.stringify(userData));
                            safeReplace("/(tabs)/home");
                        }

                        setLoading(false);
                    } catch (error: unknown) {
                        if (isErrorWithCode(error) && error.code.includes("unavailable") && Platform.OS === "android") {
                            ToastAndroid.show("Network error. Please check your connection.", ToastAndroid.SHORT);
                        }
                        Sentry.captureException(error);
                        setLoading(false);
                    }
                });

                return unsubscribe;
            } catch (error: unknown) {
                console.error("Error loading user from AsyncStorage:", getErrorMessage(error));
                Sentry.captureException(error);
                setLoading(false);
            }
        }

        loadUser();
    }, [safeReplace, setUserDetail]);

    return { loading };
};
