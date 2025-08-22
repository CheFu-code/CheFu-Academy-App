import { useState } from "react";
import ImagePicker from "react-native-image-crop-picker";

export const usePickImage = () => {
    const [error, setError] = useState({
        visible: false,
        title: "",
        message: ""
    });

    const pickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,          // Crop width
                height: 300,         // Crop height
                cropping: true,      // Enable cropping
                mediaType: "photo",  // Only photos
            });

            if (image && image.path) {
                console.log("Selected Image URI:", image.path);
                return image.path; // Return selected image URI
            }

            return null;
        } catch (error) {
            console.log("Image pick error:", error);
            setError({
                visible: true,
                title: "Image Selection Error",
                message: "Failed to pick an image. Please try again."
            });
            return null;
        }
    };

    return { pickImage, error, setError };
};
