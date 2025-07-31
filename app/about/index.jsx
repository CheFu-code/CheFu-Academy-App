import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constant/Colors";
import { styles } from "../../styles/About.styles";

export default function About() {
  const router = useRouter();
  const [backDisabled, setBackDisabled] = useState(false);
  const COPYRIGHT = `© ${new Date().getFullYear()} CheFu Inc. All rights reserved.`;

  let content;
  try {
    content = (
      <ScrollView style={styles.container} accessible accessibilityRole="scrollbar">
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (backDisabled) return;
            setBackDisabled(true);
            if (router && typeof router.back === 'function') router.back();
            setTimeout(() => setBackDisabled(false), 1000);
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
          disabled={backDisabled}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title} accessibilityRole="header">About the App</Text>

        <Text style={styles.paragraph}>
          This app was created to help users learn, manage, and track their course progress
          in an intuitive and engaging way.
        </Text>

        <Text style={styles.subtitle} accessibilityRole="header">Features</Text>
        <Text style={styles.paragraph}>• Add and manage your courses</Text>
        <Text style={styles.paragraph}>• Track learning progress</Text>
        <Text style={styles.paragraph}>• Visual insights and statistics</Text>
        <Text style={styles.paragraph}>• Clean, user-friendly design</Text>

        <Text style={styles.subtitle} accessibilityRole="header">Our Mission</Text>
        <Text style={styles.paragraph}>
          To make learning more accessible, structured, and rewarding by providing tools
          that support users on their educational journey.
        </Text>

        <Text style={styles.footer}>{COPYRIGHT}</Text>
      </ScrollView>
    );
  } catch (err) {
    content = <Text style={{ color: 'red', margin: 20 }}>Failed to load About screen.</Text>;
  }
  return content;
}

