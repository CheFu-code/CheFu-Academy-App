// app/firebase-background-handler.js
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('🔕 Background notification:', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'Background Notification',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId: 'default',
    },
  });
});
