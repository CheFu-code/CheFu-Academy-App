import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

const NOTIFICATION_CHANNEL_ID = 'default';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    try {
        const { data, notification } = remoteMessage;
        const title =
            notification?.title ||
            normalizeNotificationText(data?.title) ||
            'Background Notification';
        const body =
            notification?.body || normalizeNotificationText(data?.body) || '';

        await notifee.createChannel({
            id: NOTIFICATION_CHANNEL_ID,
            name: 'Default Channel',
            sound: 'default',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId: NOTIFICATION_CHANNEL_ID,
                smallIcon: 'ic_launcher',
                color: '#1a73e8',
                pressAction: {
                    id: 'default',
                },
                sound: 'default',
                importance: AndroidImportance.HIGH,
            },
            data: normalizeNotificationData(data),
        });
    } catch (error) {
        console.error('Error handling background notification:', error);
    }
});

function normalizeNotificationText(value: unknown) {
    if (typeof value === 'string') return value;
    if (value == null) return '';
    return JSON.stringify(value);
}

function normalizeNotificationData(data: Record<string, unknown> | undefined) {
    if (!data) return {};

    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
            key,
            normalizeNotificationText(value),
        ]),
    );
}
