import { auth, db } from "@/config/fireConfig";
import { doc, serverTimestamp, updateDoc } from "@react-native-firebase/firestore";
import { useEffect } from "react";
import { AppState } from "react-native";

export default function useLastSeenTracker() {

    useEffect(() => {
        const updateOnlineStatus = async (online: boolean) => {
            const email = auth.currentUser?.email;
            if (!email) return;

            try {
                await updateDoc(doc(db, "users", email), {
                    online,
                    ...(online ? {} : { lastSeen: serverTimestamp() }),
                });
                console.log(`[LastSeenTracker] Set online=${online}`);
            } catch (error) {
                console.error("[LastSeenTracker] Error updating Firestore:", error);
            }
        };

        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") updateOnlineStatus(true);
            else updateOnlineStatus(false);
        });

        // Set online initially
        updateOnlineStatus(true);

        return () => {
            subscription.remove();
            updateOnlineStatus(false); // optional: set offline on unmount
        };
    }, [auth.currentUser]);
}
