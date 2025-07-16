// EditProfile.js

import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { Colors } from "../../constant/Colors";

// Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/fireConfig";

export default function EditProfile() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("ZA"); // default to South Africa
  const [callingCode, setCallingCode] = useState("+27");

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.email); // ✅ use user.email here

      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setFullname(data.fullname || "");

        setPhone(data.phone || "");
        setCountryCode(data.countryCode || "");
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!fullname.trim()) newErrors.fullname = "Name is required";

    if (phone && !/^\+?[\d\s-]{7,15}$/.test(phone))
      newErrors.phone = "Phone number is invalid";

    if (!callingCode.trim()) newErrors.countryCode = "Country code is required";
    else if (!/^\+?\d{1,5}$/.test(callingCode))
      newErrors.countryCode = "Invalid country code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const userRef = doc(db, "users", user.email); // 🔥 use email from auth

      await updateDoc(userRef, {
        fullname,
        phone,
        countryCode: callingCode,
      });

      Alert.alert("Success", "Your profile has been updated!");
      router.back();
    } catch (error) {
      console.error("Failed to save profile:", error);
      Alert.alert("Error", "Could not update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFullname("");

    setPhone("");
    setCountryCode("");
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, errors.fullname && styles.errorInput]}
          placeholder="Enter your fullname"
          value={fullname}
          onChangeText={setFullname}
          autoCapitalize="words"
        />
        {errors.fullname && (
          <Text style={styles.errorText}>{errors.fullname}</Text>
        )}

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.errorInput]}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Text style={styles.label}>Country Code</Text>
        <View style={styles.countryPickerContainer}>
          <CountryPicker
            withCallingCode
            withFilter
            withFlag
            withAlphaFilter
            countryCode={countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode("+" + country.callingCode[0]);
            }}
            containerButtonStyle={styles.countryPickerButton}
          />
          <Text style={styles.callingCodeText}>{callingCode}</Text>
        </View>
        {errors.countryCode && (
          <Text style={styles.errorText}>{errors.countryCode}</Text>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { opacity: isSaving ? 0.5 : 1 },
            ]}
            onPress={() => {
              resetForm();
              router.back();
            }}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              { opacity: isSaving ? 0.5 : 1 },
            ]}
            onPress={saveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    marginTop: 100,
    backgroundColor: Colors.BG_COLOR,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    marginTop: 30,
    color: Colors.PRIMARY,
  },
  imagePicker: {
    alignSelf: "center",
    marginBottom: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  countryPickerButton: {
    flex: 1,
  },
  callingCodeText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.GREEN,
  },

  imagePlaceholder: {
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
    color: Colors.GREEN,
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007bff",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
