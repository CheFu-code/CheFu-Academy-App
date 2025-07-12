import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Button from "../../component/Shared/Button";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SuccessScreen() {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loader, setLoader] = useState(false);

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
          body: JSON.stringify({
            orderID,
            email,
            planType: userDetail.planType,
          }),
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
        router.replace("/(tabs)/profile");
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
        <Text
          style={{
            color: "red",
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          Payment verification failed.
        </Text>
        <Text>Please try again later.</Text>

        {loader ? (
          <ActivityIndicator size={"small"} color={Colors.PRIMARY} />
        ) : (
          <Button
            onPress={() => router.push("/subscription")}
            text={"Try again"}
            loading={loader}
            disabled={loader}
          />
        )}

        <Button
          onPress={() => router.push("/")}
          text={"Home"}
          loading={loader}
          disabled={loader}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <Ionicons color={"green"} name="checkmark-circle" size={24} />
        <Text style={styles.title}>Payment Receipt</Text>
      </View>
      <Text style={styles.anyText}>
        Order ID:{" "}
        <Text
          style={{
            color: Colors.PRIMARY,
          }}
        >
          {receipt.id}
        </Text>
      </Text>
      <Text style={styles.anyText}>
        Status:{" "}
        <Text
          style={{
            color: Colors.GREEN,
          }}
        >
          {" "}
          {receipt.status}{" "}
        </Text>
      </Text>

      <Text style={styles.anyText}>
        Payer:{" "}
        <Text
          style={{
            color: Colors.PRIMARY,
          }}
        >
          {receipt?.payer?.name?.given_name || "Unknown"}{" "}
          {receipt?.payer?.name?.surname || ""}
        </Text>
      </Text>

      <Text style={styles.anyText}>
        Amount:{" "}
        <Text
          style={{
            color: Colors.PRIMARY,
          }}
        >
          {receipt.purchase_units[0].payments.captures[0].amount.value}{" "}
          {receipt.purchase_units[0].payments.captures[0].amount.currency_code}
        </Text>
      </Text>

      <View style={styles.countdownContainer}>
        <ActivityIndicator size="small" color="green" />
        <Text style={styles.redirectText}>
          You'll be redirected within:{" "}
          <Text
            style={{
              color: Colors.PRIMARY,
            }}
          >
            {countdown} second
            {countdown !== 1 ? "s" : ""}.
          </Text>{" "}
          Please don't leave the app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.BG_COLOR,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  anyText: {
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
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

    color: Colors.GREEN,
  },
  countdownContainer: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    gap: 10,
  },
  redirectText: {
    fontSize: 16,
    fontStyle: "italic",
    marginLeft: 8,
    color: "white",
  },
});
