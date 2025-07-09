import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$4.99 - pay once",
    features: ["Access to free courses", "Limited quizzes", "Basic support"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99/mo",
    features: [
      "All Basic features",
      "Unlimited quizzes",
      "AI-powered explanations",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19.99/mo",
    features: [
      "All Pro features",
      "1-on-1 mentorship",
      "Early access to new content",
      "Priority support",
    ],
    popular: false,
  },
];

export default function SubscriptionWall() {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    // Add payment logic here
    alert(`Subscribed to ${selectedPlan} plan!`);
    // router.push("/home");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
          gap: 8,
        }}
      >
        <Pressable disabled={loading} onPress={() => router.back()}>
          <Ionicons
            style={{
              padding: 3,
              borderRadius: 10,
              backgroundColor: Colors.BG_GRAY,
            }}
            name="arrow-back"
            size={24}
            color={Colors.PRIMARY}
          />
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
      <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
        {loading ? (
          <ActivityIndicator size={24} color={Colors.WHITE} />
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
  header: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.PRIMARY,
    // marginTop: 30,
    // marginBottom: 10,
  },
  planCard: {
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 10,
    minWidth: 220,
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: Colors.BG_GRAY,
  },
  selectedCard: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.WHITE,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.15,
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
    marginBottom: 20,
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
