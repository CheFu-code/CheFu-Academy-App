import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SuccessScreen({ route }) {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const { orderID } = useLocalSearchParams();
  const email = userDetail?.email; // Replace with userDetail.email if available

  useEffect(() => {
    if (!orderID) {
      setLoading(false);
      ToastAndroid.show("Missing order ID", ToastAndroid.SHORT);
      return;
    }

    const captureOrder = async () => {
      try {
        const BASE_URL = "https://chefu-academy-tmzx.onrender.com";

        const res = await fetch(
          `${BASE_URL}/api/paypal/capture-order`,

          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID, email }),
          }
        );

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
});
