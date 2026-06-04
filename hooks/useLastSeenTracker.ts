import { chefuApiClient } from "@/services/chefuApiClient";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

const HEARTBEAT_INTERVAL_MS = 30_000;      // send heartbeat every 30 seconds
const HEARTBEAT_MIN_DELAY_MS = 25_000;     // minimum spacing between writes
const BASE_RETRY_MS = 1000;
const MAX_RETRIES = 3;

export default function useLastSeenTracker(email?: string) {
    const mounted = useRef(true);
    const heartbeatTimer = useRef<number | null>(null);
    const lastHeartbeatAt = useRef<number>(0);
    const retryCount = useRef(0);
    const currentEmail = useRef<string | null>(null);

    useEffect(() => {
        mounted.current = true;

        const updateOnlineStatus = async (online: boolean) => {
            const email = currentEmail.current;
            if (!email || !mounted.current) return;

            try {
                retryCount.current = 0;

                await chefuApiClient.post("/api/academy/mobile/presence", {
                    online,
                });

                if (online) lastHeartbeatAt.current = Date.now();
            } catch (err) {
                console.error("[LastSeenTracker] Firestore error:", err);

                // Retry (exponential backoff)
                if (retryCount.current < MAX_RETRIES && mounted.current) {
                    retryCount.current++;
                    const delay = BASE_RETRY_MS * 2 ** (retryCount.current - 1);

                    setTimeout(() => {
                        if (mounted.current) updateOnlineStatus(online);
                    }, delay);
                }
            }
        };

        const sendHeartbeat = async () => {
            const now = Date.now();
            if (now - lastHeartbeatAt.current < HEARTBEAT_MIN_DELAY_MS) return;
            await updateOnlineStatus(true);
        };

        const startHeartbeat = () => {
            stopHeartbeat();
            heartbeatTimer.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
        };

        const stopHeartbeat = () => {
            if (heartbeatTimer.current) {
                clearInterval(heartbeatTimer.current);
                heartbeatTimer.current = null;
            }
        };

        const handleAppState = (state: AppStateStatus) => {
            if (!currentEmail.current) return;

            if (state === "active") {
                updateOnlineStatus(true).then(startHeartbeat);
            } else {
                stopHeartbeat();
                updateOnlineStatus(false);
            }
        };

        const appStateListener = AppState.addEventListener("change", handleAppState);

        if (email) {
            currentEmail.current = email;
            updateOnlineStatus(true).then(startHeartbeat);
        } else {
            stopHeartbeat();
            currentEmail.current = null;
        }

        return () => {
            mounted.current = false;
            stopHeartbeat();
            appStateListener.remove();

            const email = currentEmail.current;
            if (!email) return;

            // Fire-and-forget offline write
            void chefuApiClient.post("/api/academy/mobile/presence", {
                online: false,
            }).catch(() => { });
        };
    }, [email]);
}
