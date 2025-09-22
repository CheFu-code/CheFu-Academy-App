export const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";

    try {
        let date: Date;

        if (typeof dateValue.toDate === "function") {
            date = dateValue.toDate(); // Firestore Timestamp
        } else {
            date = new Date(dateValue); // string or number
        }

        // Check for invalid date
        if (isNaN(date.getTime())) return "N/A";

        return date.toISOString().split("T")[0]; // YYYY-MM-DD
    } catch {
        return "N/A";
    }
};

export function parseYouTubeDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) return 0;

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    return hours * 3600 + minutes * 60 + seconds;
}
