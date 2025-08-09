import { getAuth } from "@react-native-firebase/auth";
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { useEffect } from "react";
import { AppState } from "react-native";

export default function useLastSeenTracker() {
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            async (state) => {
                const email = auth.currentUser?.email;
                if (!email) {
                    return;
                }

                if (state === "active") {
                    const now = new Date();

                    try {
                        await updateDoc(doc(db, "users", email), {
                            lastSeen: now,
                        });
                        console.log(
                            "[LastSeenTracker] Successfully updated Firestore"
                        );
                    } catch (error) {
                        console.error(
                            "[LastSeenTracker] Error updating Firestore:",
                            error
                        );
                    }
                }
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);
}
