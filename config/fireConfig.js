import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";

const app = getApp(); // gets the default native Firebase app

const auth = getAuth(app); // auth instance tied to that app

export { auth, db };
