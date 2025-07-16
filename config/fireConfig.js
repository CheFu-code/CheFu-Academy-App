
import { getApps, initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

if (!getApps().length) {
  initializeApp(); // uses native config automatically
}

const db = firestore();

export { auth, db };
