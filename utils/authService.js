import {
  createUserWithEmailAndPassword,
  getAuth,
} from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { Dimensions, Platform } from "react-native";
import * as RNLocalize from "react-native-localize";
import { DEFAULT_PREFS } from "../constant/Option";
import { handleFirebaseAuthError } from "./firebaseErrors";

const auth = getAuth();
const firestore = getFirestore();

export const signUpUser = async (fullName, email, password) => {
  try {
    const resp = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const user = resp.user;
    await user.sendEmailVerification();
    const userData = await saveUser(user, fullName, email);
    return { user, userData };
  } catch (e) {
    Sentry.captureException(e);
    handleFirebaseAuthError(e);
  }
};

const saveUser = async (user, fullName, email) => {
  try {
    const { width, height } = Dimensions.get("window");
    const deviceInfo = {
      os: Platform.OS,
      osVersion: Platform.Version,
      screenWidth: width,
      screenHeight: height,
      isTablet: width >= 600,
    };

    const country = RNLocalize.getCountry() || "ZA";
    const userEmail = (user.email ?? email)?.trim();
    const now = new Date();

    const userFullName = user.displayName || fullName || "";
    const userPhoto = user?.photoURL ?? null;
    const userProvider =
      user?.providerData?.[0]?.providerId ?? user?.providerId ?? "email";

    const userDocRef = doc(firestore, "users", userEmail);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const existingData = userDoc.data();
      const updatedData = {
        ...existingData,
        lastLogin: now,
        updatedAt: now,
        fullname: userFullName,
        profilePicture: userPhoto,
        provider: userProvider,
      };
      await setDoc(userDocRef, updatedData, { merge: true });
      return updatedData;
    } else {
      const data = {
        fullname: userFullName,
        email: userEmail,
        member: false,
        isVerified: user.emailVerified,
        createdAt: now,
        updatedAt: now,
        uid: user.uid,
        emailPreferences: DEFAULT_PREFS,
        profilePicture: userPhoto,
        lastLogin: now,
        provider: userProvider,
        onboardingComplete: false,
        roles: ["user"],
        bio: "",
        language: "en",
        country,
        subscriptionStatus: "free",
        deviceInfo,
      };

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      console.log("Saving user data:", cleanData);

      await setDoc(userDocRef, cleanData);

      await sendWelcomeEmail(userEmail, userFullName);
      return cleanData;
    }
  } catch (e) {
    Sentry.captureException(e);
    console.log("Error in saveUser:", e.message);
    throw new Error("Failed to save your data. Please try again later.");
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    await fetch(
      "https://chefu-academy-tmzx.onrender.com/api/email/send-welcome",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      }
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error("Failed to send welcome email:", error);
  }
};
