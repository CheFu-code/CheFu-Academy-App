"use client";

import { auth, db } from "@/lib/firebase";
import { Course } from "@/types/course";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export async function getCoursesForLoggedInUser(): Promise<Course[]> {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
        collection(db, "course"),
        where("createdBy", "==", user.email),
        orderBy("createdOn", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Course[];
}
