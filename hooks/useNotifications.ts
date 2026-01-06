import { DAILY_NOTIFICATION } from "@/constant/caches";
import notifee from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp } from "@react-native-firebase/app";
import { getMessaging, onMessage } from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { requestUserPermission } from "../app/notifications/requestUserPermission";
import { scheduleDailyNotification } from "../app/notifications/scheduleLocalNotification";

const NOTIFICATION_CHANNEL_ID = "default";

export function useNotifications() {
    useEffect(() => {
        requestUserPermission();

        async function createNotificationSetup() {
            await notifee.createChannel({
                id: NOTIFICATION_CHANNEL_ID,
                name: "Default Channel",
                sound: "default",
                importance: 4, // AndroidImportance.HIGH
            });

            const alreadyScheduled = await AsyncStorage.getItem(DAILY_NOTIFICATION);

            if (!alreadyScheduled) {
                await scheduleDailyNotification();
                await AsyncStorage.setItem(DAILY_NOTIFICATION, "true");
            }
        }

        createNotificationSetup();

        const unsubscribe = onMessage(getMessaging(getApp()), async (remoteMessage) => {
            await notifee.displayNotification({
                title: remoteMessage.notification?.title || "Notification",
                body: remoteMessage.notification?.body || "",
                android: { channelId: NOTIFICATION_CHANNEL_ID },
            });
        });

        return () => unsubscribe();
    }, []);
}