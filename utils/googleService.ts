// utils/authService.ts
import { auth } from "@/config/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export async function signInWithGoogle() {

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();
    const credential = GoogleAuthProvider.credential(idToken);
    const firebaseUserCredential = await signInWithCredential(auth, credential);

    return firebaseUserCredential;
}
