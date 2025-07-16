import messaging from "@react-native-firebase/messaging";
import "../config/fireConfig"; // Make sure this initializes firebase (if needed)

console.log("🟢 Background handler loaded");

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("🔕 Background notification:", remoteMessage);
  // You can integrate expo-notifications or local push here if needed
});
