import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SuccessScreen() {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const router = useRouter();
  const params = useLocalSearchParams();
  const orderID = params.token;
  const email = userDetail?.email;

  useEffect(() => {
    if (!orderID) {
      setLoading(false);
      ToastAndroid.show("Missing order ID", ToastAndroid.SHORT);
      return;
    }

    const captureOrder = async () => {
      try {
        const BASE_URL = "https://chefu-academy-tmzx.onrender.com";

        const res = await fetch(`${BASE_URL}/api/paypal/capture-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID, email }),
        });

        const data = await res.json();

        if (res.ok) {
          setReceipt(data.details);
          ToastAndroid.show("Payment captured", ToastAndroid.SHORT);
          setUserDetail((prev) => ({ ...prev, member: true }));
        } else {
          ToastAndroid.show("Capture failed", ToastAndroid.SHORT);
        }
        console.log("Capture response:", JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Capture error:", error);
        ToastAndroid.show("Network error", ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };

    captureOrder();
  }, []);

  // Countdown and redirect effect
  useEffect(() => {
    if (receipt) {
      if (countdown === 0) {
        router.replace("/profile"); // or your profile screen path
      }

      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, receipt]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Verifying payment...</Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View style={styles.center}>
        <Text>Payment verification failed.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Payment Receipt</Text>
      <Text>Order ID: {receipt.id}</Text>
      <Text>Status: {receipt.status}</Text>
      <Text>
        Payer: {receipt?.payer?.name?.given_name || "Unknown"}{" "}
        {receipt?.payer?.name?.surname || ""}
      </Text>

      <Text>
        Amount: {receipt.purchase_units[0].payments.captures[0].amount.value}{" "}
        {receipt.purchase_units[0].payments.captures[0].amount.currency_code}
      </Text>

      <Text style={styles.redirectText}>
        You'll be redirected within: {countdown} second{countdown !== 1 ? "s" : ""}. Please don't leave the app.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "outfit-bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  redirectText: {
    marginTop: 30,
    fontSize: 16,
    fontStyle: "italic",
  },
});
