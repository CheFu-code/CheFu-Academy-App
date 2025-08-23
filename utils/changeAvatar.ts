import { getAuth } from "@react-native-firebase/auth";
import { doc, getFirestore, serverTimestamp, updateDoc } from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { showToast } from "./toast";

export const changeAvatar = async (setUserDetail: (updater: (prev: any) => any) => void) => {
    try {
        // 1. Pick a single image
        const image = await ImagePicker.openPicker({
            width: 300,            // Crop width
            height: 300,           // Crop height
            cropping: true,        // Enable cropping
            mediaType: "photo",    // Only allow photos
            compressImageMaxWidth: 1024,     // Resize image max width
            compressImageMaxHeight: 1024,    // Resize image max height
            compressImageQuality: 1,       // Compress image quality (0-1)
            includeBase64: false,            // Return base64 string if true
            includeExif: true,               // Include EXIF metadata
            cropperCircleOverlay: false,     // Circular crop overlay
            freeStyleCropEnabled: true,      // Allow free-style cropping
            multiple: false,                 // Allow selecting multiple images
            forceJpg: true,                  // Convert images to JPG
            avoidEmptySpaceAroundImage: true // Reduce empty space after crop
        });


        if (!image || !image.path) return null;

        // 2. Get current user
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");
        showToast("Updating...");
        const path = `avatars/${user.uid}.jpg`;

        // 3. Upload the file to Firebase Storage
        await storage().ref(path).putFile(image.path);

        // 4. Get download URL
        const downloadURL = await storage().ref(path).getDownloadURL();

        // 5. Update Firebase Auth profile
        await user.updateProfile({ photoURL: downloadURL });

        const db = getFirestore();

        if (!user.email) {
            throw new Error("User email not available");
        }

        await updateDoc(doc(db, "users", user.email), {
            profilePicture: downloadURL,
            updatedAt: serverTimestamp(),
        });

        setUserDetail((prev) => prev ? { ...prev, profilePicture: downloadURL } : prev);

        showToast("Profile updated successfully!");
        return downloadURL;
    } catch (error: any) {
        console.error("Error changing avatar:", error);

        if (error.message.includes("User cancelled image selection")) {
            showToast("Image selection cancelled.");
        } else if (error.message.includes("ssl") || error.message.includes("Connection reset")) {
            showToast("Network error. Please check your connection and try again.");
        } else {
            showToast("Error changing avatar. Please try again.");
        }

        return null;
    }
};
