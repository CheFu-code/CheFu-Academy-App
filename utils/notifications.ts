// utils/notifications.ts
import { chefuFetch } from '@/services/chefuApiClient';

export async function sendNotification(
    userEmail: string,
    title: string,
    body: string
): Promise<void> {
    try {
        const response = await chefuFetch(
            "/api/academy/mobile/notifications/send",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userEmail, title, body }),
            },
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
