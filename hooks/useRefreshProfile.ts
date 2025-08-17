// hooks/useRefreshProfile.ts
import { showToast } from "@/utils/toast";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useCallback, useRef, useState } from "react";

export function useRefreshProfile(email: string, setUserDetail: any) {
    const [refreshing, setRefreshing] = useState(false);
    const fetchingRef = useRef(false);

    const refreshData = useCallback(async () => {
        if (fetchingRef.current || !email) return;

        setRefreshing(true);
        fetchingRef.current = true;

        try {
            const firestore = getFirestore();
            const snap = await getDoc(doc(firestore, "users", email));
            if (snap.exists()) {
                setUserDetail(snap.data());
                showToast("Profile refreshed");
            } else {
                showToast("Your data not found");
            }
        } catch (err) {
            Sentry.captureException(err);
            showToast("Failed to refresh profile");
        } finally {
            setRefreshing(false);
            fetchingRef.current = false;
        }
    }, [email, setUserDetail]);

    return { refreshing, refreshData };
}
