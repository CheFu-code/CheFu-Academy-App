import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

const app = getApp(); // get the default app instance
const auth = getAuth(app); // auth instance tied to that app
const db = getFirestore();

export { auth, db };
