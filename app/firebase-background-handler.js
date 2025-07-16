// app/firebase-background-handler.js
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

console.log("🟢 Background handler loaded");

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("🔕 Background notification:", remoteMessage);

  // Show a local notification when a message arrives in background
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'Background Notification',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId: 'default', // ensure you created this channel already
    },
  });
});
