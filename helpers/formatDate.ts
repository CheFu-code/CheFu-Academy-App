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