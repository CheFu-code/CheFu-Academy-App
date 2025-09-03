import { db } from "@/lib/firebase";
import { arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { deviceType, userId } = body;
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        const docRef = doc(db, "userActivity", today);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const countedUsers = data.users || [];

            if (!countedUsers.includes(userId)) {
                await updateDoc(docRef, {
                    [deviceType]: increment(1),
                    users: arrayUnion(userId),
                });
            }
        } else {
            await setDoc(docRef, {
                desktop: deviceType === "desktop" ? 1 : 0,
                mobile: deviceType === "mobile" ? 1 : 0,
                users: [userId],
            });
        }

        return NextResponse.json({ message: "Activity tracked" });
    } catch (err) {
        return NextResponse.json({ message: "Failed", error: err }, { status: 500 });
    }
}
