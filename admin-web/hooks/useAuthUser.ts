"use client";

import { auth, db } from "@/lib/firebase";
import { User } from "@/types/user";
import { doc, getDoc } from "@firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                const docRef = doc(db, "users", firebaseUser.email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser(docSnap.data() as User);
                } else {
                    setUser({
                        email: firebaseUser.email,
                        fullname: "",
                    } as User); // fallback
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}
