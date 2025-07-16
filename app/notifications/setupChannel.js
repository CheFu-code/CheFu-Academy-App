// notifications/setupChannel.ts

import notifee from '@notifee/react-native';

export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: notifee.AndroidImportance.HIGH,
  });
}
