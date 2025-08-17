// utils/notifications.ts

export async function sendNotification(
    userEmail: string,
    title: string,
    body: string
): Promise<void> {
    try {
        const response = await fetch(
            "https://chefu-academy-tmzx.onrender.com/api/sendToUser",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userEmail, title, body }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Failed to send notification:", errorText);
        } else {
            console.log("✅ Notification sent successfully!");
        }
    } catch (error) {
        console.error("❌ Error sending notification:", error);
    }
}
