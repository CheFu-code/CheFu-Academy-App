// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import CountryPicker from "react-native-country-picker-modal";
// import { Colors } from "../../constant/Colors";

// // Firebase
// import auth from "@react-native-firebase/auth";
// import {
//     doc,
//     getDoc,
//     getFirestore,
//     updateDoc,
// } from "@react-native-firebase/firestore";
// import * as Sentry from "@sentry/react-native";
// import LottieView from "lottie-react-native";

// export default function EditProfile() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [fullname, setFullname] = useState("");
//     const [phone, setPhone] = useState("");
//     const [countryCode, setCountryCode] = useState("ZA");
//     const [callingCode, setCallingCode] = useState("+27");
//     const [errors, setErrors] = useState({});
//     const [isSaving, setIsSaving] = useState(false);
//     const db = getFirestore();

//     useEffect(() => {
//         const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
//             if (!currentUser) {
//                 router.replace("/auth/signIn");
//                 setLoading(false);
//                 return;
//             }

//             setUser(currentUser);

//             const fetchData = async () => {
//                 try {
//                     const userRef = doc(db, "users", currentUser.email);
//                     const snap = await getDoc(userRef);
//                     if (snap.exists()) {
//                         const data = snap.data();
//                         setFullname(data.fullname || "");
//                         setPhone(data.phone || "");
//                         setCountryCode(data.countryCode || "ZA");
//                         setCallingCode(data.callingCode || "+27");
//                     }
//                 } catch (error) {
//                     console.error("Failed to fetch profile data:", error);
//                     Sentry.captureException(error);
//                     Alert.alert(
//                         "Error",
//                         "Could not load your profile. Please try again later."
//                     );
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             fetchData();
//         });

//         return () => unsubscribe();
//     }, []);

//     if (loading) {
//         return (
//             <View
//                 style={{
//                     flex: 1,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     backgroundColor: Colors.WHITE,
//                 }}
//             >
//                 <LottieView
//                     source={require("../../assets/images/loading.json")}
//                     autoPlay
//                     loop
//                     style={{ width: 150, height: 150 }}
//                 />

//                 <Text
//                     style={{
//                         color: Colors.GREEN,
//                         fontFamily: "outfit-bold",
//                         fontSize: 24,
//                         marginTop: 10,
//                     }}
//                 >
//                     Hang tight!
//                 </Text>

//                 <Text
//                     style={{
//                         color: "black",
//                         marginTop: 10,
//                         fontFamily: "outfit-bold",
//                         fontSize: 16,
//                         textAlign: "center",
//                     }}
//                 >
//                     Setting up your profile...
//                 </Text>
//             </View>
//         );
//     }

//     const validate = () => {
//         const newErrors = {};
//         if (!fullname.trim()) newErrors.fullname = "Name is required";

//         if (phone && !/^\+?[\d\s-]{7,15}$/.test(phone))
//             newErrors.phone = "Phone number is invalid";

//         if (!callingCode.trim())
//             newErrors.countryCode = "Country code is required";
//         else if (!/^\+?\d{1,5}$/.test(callingCode))
//             newErrors.countryCode = "Invalid country code";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const saveProfile = async () => {
//         if (!validate() || isSaving) return;

//         setIsSaving(true);
//         try {
//             const user = auth.currentUser;
//             if (!user) throw new Error("User not logged in");

//             const userRef = doc(db, "users", user.email); // 🔥 use email from auth

//             await updateDoc(userRef, {
//                 fullname,
//                 phone,
//                 countryCode,
//                 callingCode,
//             });

//             Alert.alert("Success", "Your profile has been updated!");
//             router.back();
//         } catch (error) {
//             console.error("Failed to save profile:", error);
//             Sentry.captureException(error);
//             let errorMessage =
//                 "An unexpected error occurred. Please try again.";
//             if (error.code) {
//                 switch (error.code) {
//                     case "permission-denied":
//                         errorMessage =
//                             "You do not have permission to perform this action.";
//                         break;
//                     case "unavailable":
//                         errorMessage =
//                             "The service is currently unavailable. Please try again later.";
//                         break;
//                 }
//             }
//             Alert.alert("Update Failed", errorMessage);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             style={{ flex: 1 }}
//         >
//             <View
//                 style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 10,
//                     paddingHorizontal: 20,
//                     paddingTop: 40,
//                     backgroundColor: Colors.BG_COLOR,
//                     zIndex: 10,
//                 }}
//             >
//                 <Pressable onPress={() => !isSaving && router.back()}>
//                     <Ionicons
//                         style={{
//                             padding: 3,
//                             borderRadius: 10,
//                             backgroundColor: Colors.BG_GRAY,
//                         }}
//                         name="arrow-back"
//                         size={24}
//                         color={Colors.PRIMARY}
//                     />
//                 </Pressable>
//                 <Text style={styles.headerTitle}>Edit Profile</Text>
//             </View>

//             <ScrollView
//                 contentContainerStyle={styles.container}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <Text style={styles.label}>Name</Text>
//                 <TextInput
//                     style={[styles.input, errors.fullname && styles.errorInput]}
//                     placeholder="Enter your fullname"
//                     value={fullname}
//                     onChangeText={setFullname}
//                     autoCapitalize="words"
//                     placeholderTextColor={Colors.WHITE}
//                 />
//                 {errors.fullname && (
//                     <Text style={styles.errorText}>{errors.fullname}</Text>
//                 )}

//                 <Text style={styles.label}>Phone Number</Text>
//                 <TextInput
//                     style={[styles.input, errors.phone && styles.errorInput]}
//                     placeholder="Enter your phone number"
//                     value={phone}
//                     onChangeText={setPhone}
//                     keyboardType="phone-pad"
//                     placeholderTextColor={Colors.WHITE}
//                 />
//                 {errors.phone && (
//                     <Text style={styles.errorText}>{errors.phone}</Text>
//                 )}

//                 <Text style={styles.label}>Country Code</Text>
//                 <View style={styles.countryPickerContainer}>
//                     <CountryPicker
//                         withCallingCode
//                         withFilter
//                         withFlag
//                         withAlphaFilter
//                         countryCode={countryCode}
//                         onSelect={(country) => {
//                             if (country?.callingCode?.length && country?.cca2) {
//                                 setCountryCode(country.cca2);
//                                 setCallingCode("+" + country.callingCode[0]);
//                             } else {
//                                 console.warn(
//                                     "Invalid country selected:",
//                                     country
//                                 );
//                             }
//                         }}
//                         containerButtonStyle={styles.countryPickerButton}
//                     />
//                     <Text style={styles.callingCodeText}>
//                         {callingCode ?? "+00"}
//                     </Text>
//                 </View>
//                 {errors.countryCode && (
//                     <Text style={styles.errorText}>{errors.countryCode}</Text>
//                 )}

//                 <View style={styles.buttonsContainer}>
//                     <TouchableOpacity
//                         style={[
//                             styles.button,
//                             styles.cancelButton,
//                             { opacity: isSaving ? 0.5 : 1 },
//                         ]}
//                         onPress={() => {
//                             if (isSaving) return;
//                             router.back();
//                         }}
//                         disabled={isSaving}
//                     >
//                         <Text style={styles.cancelButtonText}>Cancel</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[
//                             styles.button,
//                             styles.saveButton,
//                             { opacity: isSaving ? 0.5 : 1 },
//                         ]}
//                         onPress={saveProfile}
//                         disabled={isSaving}
//                     >
//                         {isSaving ? (
//                             <ActivityIndicator color="#fff" />
//                         ) : (
//                             <Text style={styles.saveButtonText}>Save</Text>
//                         )}
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         paddingBottom: 40,
//         backgroundColor: Colors.BG_COLOR,
//         flexGrow: 1,
//         marginTop: 60,
//     },
//     headerTitle: {
//         fontSize: 28,
//         fontWeight: "bold",
//         color: Colors.PRIMARY,
//     },
//     imagePicker: {
//         alignSelf: "center",
//         marginBottom: 30,
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: "#eee",
//         justifyContent: "center",
//         alignItems: "center",
//         overflow: "hidden",
//     },
//     countryPickerContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#bbb",
//         borderRadius: 8,
//         padding: 10,
//         marginBottom: 10,
//         backgroundColor: "white",
//     },
//     countryPickerButton: {
//         flex: 1,
//     },
//     callingCodeText: {
//         fontSize: 16,
//         marginLeft: 10,
//         color: Colors.GREEN,
//     },

//     imagePlaceholder: {
//         color: "#999",
//         textAlign: "center",
//         paddingHorizontal: 10,
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 6,
//         fontWeight: "600",
//         color: "white",
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "#bbb",
//         borderRadius: 8,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         fontSize: 16,
//         marginBottom: 10,
//         color: Colors.GREEN,
//     },
//     bioInput: {
//         height: 80,
//         textAlignVertical: "top",
//     },
//     errorInput: {
//         borderColor: "red",
//     },
//     errorText: {
//         color: "red",
//         marginBottom: 10,
//     },
//     buttonsContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 20,
//     },
//     button: {
//         flex: 1,
//         paddingVertical: 14,
//         borderRadius: 8,
//         alignItems: "center",
//     },
//     cancelButton: {
//         backgroundColor: "#ccc",
//         marginRight: 10,
//     },
//     cancelButtonText: {
//         color: "#333",
//         fontWeight: "600",
//     },
//     saveButton: {
//         backgroundColor: "#007bff",
//         marginLeft: 10,
//     },
//     saveButtonText: {
//         color: "#fff",
//         fontWeight: "600",
//     },
// });
