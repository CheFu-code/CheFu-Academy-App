import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

const app = getApp(); // gets the default native Firebase app

const auth = getAuth(app); // auth instance tied to that app
const db = getFirestore(app); // firestore tied to that app

export { auth, db };
