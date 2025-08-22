import { getAuth } from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";

export const changeAvatar = async () => {
    try {
        // 1. Pick a single image
        const image = await ImagePicker.openPicker({
            width: 300,            // Crop width
            height: 300,           // Crop height
            cropping: true,        // Enable cropping
            mediaType: "photo",    // Only allow photos
            compressImageMaxWidth: 1024,     // Resize image max width
            compressImageMaxHeight: 1024,    // Resize image max height
            compressImageQuality: 0.8,       // Compress image quality (0-1)
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

        const path = `avatars/${user.uid}.jpg`;

        // 3. Upload the file to Firebase Storage
        await storage().ref(path).putFile(image.path);

        // 4. Get download URL
        const downloadURL = await storage().ref(path).getDownloadURL();

        // 5. Update Firebase Auth profile
        await user.updateProfile({ photoURL: downloadURL });

        console.log("Avatar updated successfully!", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error changing avatar:", error);
        return null;
    }
};
