"use client";
// components/TrackUser
import { getUserId } from "@/utils/getUserId";
import { useEffect } from "react";

export default function TrackUser() {
    useEffect(() => {
        const track = async () => {
            const deviceType = /Mobi|Android/i.test(navigator.userAgent)
                ? "mobile"
                : "desktop";
            const userId = getUserId();

            await fetch("/api/track-activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceType, userId }),
            });
        };

        track(); // ✅ Call the function here
    }, []);

    return null;
}
