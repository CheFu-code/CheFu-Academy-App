// app/firebase-background-handler.js
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import '../config/fireConfig'; // Optional if using compat SDK for auth/firestore

console.log("🟢 Background handler loaded");

setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  console.log("🔕 Background notification:", remoteMessage);

  // Optional: show local notification here using expo-notifications if needed
});
