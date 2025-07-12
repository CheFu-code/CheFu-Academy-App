import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as RNIap from "react-native-iap";
import { db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { PLANS } from "../../constant/plans";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SubscriptionWall() {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const subscriptionSkus = ["basic_monthly", "pro_monthly", "premium_monthly"];

  const handleSubscribe = async () => {
    try {
      console.log("Subscription process started");

      if (userDetail?.member === true) {
        console.log("User is already a member");
        ToastAndroid.show("You're already a member", ToastAndroid.SHORT);
        return;
      }

      console.log("Selected plan:", selectedPlan);
      setLoading(true);

      await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      console.log("IAP connection initialized");

      const subs = await RNIap.getSubscriptions(subscriptionSkus);
      console.log("Available subscriptions:", subs);

      const selectedSku = subs.find((sub) =>
        sub.productId.includes(selectedPlan)
      );
      console.log("Selected SKU:", selectedSku);

      if (!selectedSku) {
        ToastAndroid.show("Subscription not found", ToastAndroid.SHORT);
        return;
      }

      const purchase = await RNIap.requestSubscription({
        sku: selectedSku.productId,
        andDangerouslyFinishTransactionAutomatically: true,
      });

      console.log("Purchase result:", purchase);

      if (purchase && purchase.transactionId) {
        console.log("Purchase successful");
        Sentry.captureMessage(`User subscribed to: ${selectedPlan}`);

        const userDocRef = doc(db, "users", userDetail.email);
        await setDoc(
          userDocRef,
          {
            member: true,
            plan: selectedPlan, // track selected plan
            updatedAt: new Date(),
          },
          { merge: true }
        );

        setUserDetail((prev) => ({ ...prev, member: true }));
        ToastAndroid.show("Subscription successful!", ToastAndroid.SHORT);
      } else {
        console.warn("Purchase failed or canceled");
        ToastAndroid.show("Payment failed or canceled", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("IAP error:", error);
      Sentry.captureException(error);
      ToastAndroid.show("Subscription failed. Try again.", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      RNIap.endConnection();
      console.log("IAP connection closed");
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
        style={styles.subscribeBtn}
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
    shadowOpacity: 0.10,
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
