import { chefuApiClient } from '@/services/chefuApiClient';
import { UserDetail } from '@/types/UserDetail';
import * as FileSystem from 'expo-file-system';
import ImagePicker from 'react-native-image-crop-picker';
import { showToast } from './toast';

export const changeAvatar = async (
    setUserDetail: (updater: (prev: any) => any) => void,
    userDetail: UserDetail | null,
) => {
    try {
        // 1. Pick a single image
        const image = await ImagePicker.openPicker({
            width: 300, // Crop width
            height: 300, // Crop height
            cropping: true, // Enable cropping
            mediaType: 'photo', // Only allow photos
            compressImageMaxWidth: 1024, // Resize image max width
            compressImageMaxHeight: 1024, // Resize image max height
            compressImageQuality: 1, // Compress image quality (0-1)
            includeBase64: false, // Return base64 string if true
            includeExif: true, // Include EXIF metadata
            cropperCircleOverlay: false, // Circular crop overlay
            freeStyleCropEnabled: true, // Allow free-style cropping
            multiple: false, // Allow selecting multiple images
            forceJpg: true, // Convert images to JPG
            avoidEmptySpaceAroundImage: true, // Reduce empty space after crop
        });

        if (!image || !image.path) return null;

        if (!userDetail?.uid || !userDetail.email) {
            throw new Error('No user logged in');
        }
        showToast('Updating...');
        const imageBase64 = await FileSystem.readAsStringAsync(image.path, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const response = await chefuApiClient.post('/api/academy/mobile/avatar', {
            contentType: image.mime || 'image/jpeg',
            imageBase64,
        });
        const downloadURL = response.data?.profilePicture;

        if (!downloadURL) {
            throw new Error('Backend did not return an avatar URL');
        }

        setUserDetail((prev) =>
            prev ? { ...prev, profilePicture: downloadURL } : prev,
        );

        showToast('Profile updated successfully!');
        return downloadURL;
    } catch (error: any) {
        if (error.message.includes('User cancelled image selection')) {
            showToast('Image selection cancelled.');
        } else if (
            error.message.includes('ssl') ||
            error.message.includes('Connection reset')
        ) {
            showToast(
                'Network error. Please check your connection and try again.',
            );
        } else {
            showToast('Error changing avatar. Please try again.');
        }

        return null;
    }
};
