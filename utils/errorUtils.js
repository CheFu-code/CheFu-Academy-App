import { Alert } from "react-native";

export const handleAiError = (error, supportEmail) => {
  console.error("Failed to parse AI response:", error);
  Alert.alert(
    "Error",
    `Our AI did not respond with supported data.\nPlease try again later. If the issue persists, contact support: ${supportEmail}`
  );
};