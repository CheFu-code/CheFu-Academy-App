// hooks/useRefreshProfile.ts
import { chefuApiClient } from "@/services/chefuApiClient";
import { showToast } from "@/utils/toast";
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
            const response = await chefuApiClient.get("/api/academy/mobile/me");
            setUserDetail(response.data);
            showToast("Profile refreshed");
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
