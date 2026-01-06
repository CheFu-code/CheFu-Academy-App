import { auth, db } from "@/config/firebaseConfig";
import { doc, serverTimestamp, updateDoc } from "@react-native-firebase/firestore";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

const HEARTBEAT_INTERVAL_MS = 30_000;      // send heartbeat every 30 seconds
const HEARTBEAT_MIN_DELAY_MS = 25_000;     // minimum spacing between writes
const BASE_RETRY_MS = 1000;
const MAX_RETRIES = 3;

export default function useLastSeenTracker() {
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

            const ref = doc(db, "users", email);

            try {
                retryCount.current = 0;

                await updateDoc(ref, {
                    online,
                    ...(online
                        ? { lastHeartbeat: serverTimestamp() }
                        : { lastSeen: serverTimestamp() }
                    ),
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

        // Auth state listener (production best practice)
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) {
                // signed out
                stopHeartbeat();
                currentEmail.current = null;
                return;
            }

            const email = user.email ?? null;
            if (!email) return;

            currentEmail.current = email;

            updateOnlineStatus(true).then(startHeartbeat);
        });

        // Initial boot condition
        if (auth.currentUser?.email) {
            currentEmail.current = auth.currentUser.email;
            updateOnlineStatus(true).then(startHeartbeat);
        }

        return () => {
            mounted.current = false;
            stopHeartbeat();
            appStateListener.remove();
            unsubscribeAuth();

            const email = currentEmail.current;
            if (!email) return;

            const ref = doc(db, "users", email);

            // Fire-and-forget offline write
            updateDoc(ref, {
                online: false,
                lastSeen: serverTimestamp(),
            }).catch(() => { });
        };
    }, []);
}
