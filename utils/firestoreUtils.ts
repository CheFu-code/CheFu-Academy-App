import { db } from "@/config/fireConfig";
import {
    collection,
    getDocs,
    query,
    Timestamp,
    where
} from "@react-native-firebase/firestore";

/**
 * Check how many courses a user has created today.
 */
export const checkDailyLimit = async (email: string) => {
    const now = new Date();

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const courseQuery = query(
        collection(db, "course"),
        where("createdBy", "==", email),
        where("createdOn", ">=", Timestamp.fromDate(startOfDay)),
        where("createdOn", "<=", Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(courseQuery);
    return snapshot.size; // number of courses created today
};
