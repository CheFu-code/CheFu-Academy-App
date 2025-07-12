import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { PLANS } from "../../constant/plans";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SubscriptionWall() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const subscriptionSkus = ["basic_monthly", "pro_monthly", "premium_monthly"];

  const BASE_URL = "https://chefu-academy-tmzx.onrender.com";

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:
            selectedPlan === "premium"
              ? "19.99"
              : selectedPlan === "pro"
              ? "9.99"
              : "4.99",
        }),
      });

      const data = await res.json();

      if (data?.links) {
        const approvalUrl = data.links.find(
          (link) => link.rel === "approve"
        )?.href;
        if (approvalUrl) {
          Linking.openURL(approvalUrl);
        } else {
          ToastAndroid.show("Unable to initiate PayPal", ToastAndroid.SHORT);
        }
      } else {
        console.log("PayPal create-order error:", data);
        Sentry.captureException("PayPal create-order error:", data);
        ToastAndroid.show("Payment init failed", ToastAndroid.SHORT);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      Sentry.captureException(err);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable disabled={loading} onPress={() => router.back()}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.PRIMARY} />
          </View>
        </Pressable>
        <Text style={styles.header}>Choose Your Plan</Text>
      </View>

      <FlatList
        data={PLANS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === item.id && styles.selectedCard,
              item.popular && styles.popularCard,
            ]}
            onPress={() => setSelectedPlan(item.id)}
            activeOpacity={0.6}
          >
            <Text style={styles.planName}>{item.name}</Text>
            <Text style={styles.planPrice}>{item.price}</Text>
            {item.popular && (
              <Text style={styles.popularLabel}>Most Popular</Text>
            )}
            {item.features.map((f, idx) => (
              <Text key={idx} style={styles.feature}>
                • {f}
              </Text>
            ))}
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
      />

      <TouchableOpacity
        disabled={loading}
        style={[styles.subscribeBtn, { opacity: loading ? 0.5 : 1 }]}
        onPress={handleSubscribe}
      >
        {loading ? (
          <ActivityIndicator size={24} color={Colors.GREEN} />
        ) : (
          <Text style={styles.subscribeText}>Subscribe</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    padding: 20,
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.BG_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.PRIMARY,
  },
  planCard: {
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 10,
    marginVertical: 90,
    minWidth: 220,
    height: 350,
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: Colors.BG_GRAY,
  },
  selectedCard: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.LIGHT_GREEN,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularCard: {
    borderColor: Colors.GREEN,
  },
  planName: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  planPrice: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.GRAY,
    marginBottom: 10,
  },
  popularLabel: {
    fontFamily: "outfit-bold",
    color: Colors.GREEN,
    fontSize: 14,
    marginBottom: 8,
  },
  feature: {
    fontFamily: "outfit",
    fontSize: 15,
    color: Colors.PRIMARY,
    marginBottom: 2,
  },
  subscribeBtn: {
    marginTop: 30,
    marginBottom: 50,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  subscribeText: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.LIGHT_GREEN,
    textAlign: "center",
  },
});
