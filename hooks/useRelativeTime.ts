import { useEffect, useState } from "react";

export default function useRelativeTime(timestamp: any) {
    const [timeAgo, setTimeAgo] = useState("");

    useEffect(() => {
        if (!timestamp) return;

        const updateTime = () => {
            const date =
                timestamp?.toDate?.() || new Date(timestamp.seconds * 1000);
            const diff = Date.now() - date.getTime();

            if (diff < 60 * 1000) {
                setTimeAgo("just now");
            } else if (diff < 60 * 60 * 1000) {
                setTimeAgo(`${Math.floor(diff / 60000)} min ago`);
            } else if (diff < 24 * 60 * 60 * 1000) {
                setTimeAgo(`${Math.floor(diff / 3600000)} hrs ago`);
            } else {
                setTimeAgo(date.toLocaleDateString());
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [timestamp]);

    return timeAgo;
}
