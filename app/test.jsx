import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, View } from "react-native";

export default function SendTestNotificationButton() {
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    const user = auth().currentUser;
    if (!user?.email) {
      Alert.alert("Error", "You must be logged in to send a test notification.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://10.35.176.122:5000/api/sendToUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          title: "🚀 Test Notification",
          body: "This is a test notification sent from the app button!",
        }),
      });

      if (response.ok) {
        console.log("Test notification sent!");
      } else {
        const text = await response.text();
        Alert.alert("Failed", `Server error: ${text}`);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ margin: 20 }}>
      <Button
        title={loading ? "Sending..." : "Send Test Notification"}
        onPress={sendTestNotification}
        disabled={loading}
      />
      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
}
