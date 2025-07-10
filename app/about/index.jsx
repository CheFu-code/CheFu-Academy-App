import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constant/Colors";

export default function About() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>About the App</Text>

      <Text style={styles.paragraph}>
        This app was created to help users learn, manage, and track their course progress
        in an intuitive and engaging way.
      </Text>

      <Text style={styles.subtitle}>Features</Text>
      <Text style={styles.paragraph}>• Add and manage your courses</Text>
      <Text style={styles.paragraph}>• Track learning progress</Text>
      <Text style={styles.paragraph}>• Visual insights and statistics</Text>
      <Text style={styles.paragraph}>• Clean, user-friendly design</Text>

      <Text style={styles.subtitle}>Our Mission</Text>
      <Text style={styles.paragraph}>
        To make learning more accessible, structured, and rewarding by providing tools
        that support users on their educational journey.
      </Text>

      <Text style={styles.footer}>© {new Date().getFullYear()} CheFu Inc. All rights reserved.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.BG_COLOR,
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  backText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontFamily: "outfit",
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.GRAY,
    lineHeight: 24,
    marginBottom: 10,
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    color: Colors.GRAY,
    fontFamily: "outfit",
    textAlign: "center",
  },
});
