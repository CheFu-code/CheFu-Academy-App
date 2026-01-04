import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// const app = getApp(); // get the default app instance
const auth = getAuth(); // auth instance tied to that app
const db = getFirestore();
const user = auth.currentUser;

export { auth, db, user };
