// firebase-background-handler.js
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("🔕 Background notification:", remoteMessage);
  // You can show a local notification or handle logic here if needed
});
