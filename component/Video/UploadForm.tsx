import { Colors } from "@/constant/Colors";
import { VideoCategory } from "@/constant/Option";
import { UploadFormProps } from "@/types/video";
import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import { styles } from "../../styles/UploadVideo.styles";
import VideoCard from "./VideoCard";

export default function UploadForm({
    videoUri,
    setVideoUri,
    thumbnailUri,
    setThumbnailUri,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    visibility,
    setVisibility,
    loading,
    setLoading,
}: UploadFormProps) {
    const pickVideo = async () => {
        setLoading(true);
        try {
            const res = await ImagePicker.openPicker({
                mediaType: "video",
                multiple: false,
            });
            if (res && res.path) {
                setVideoUri(res.path);
            }
        } catch (err) {
            console.log("Video picking cancelled or failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const pickThumbnail = async () => {
        setLoading(true);
        try {
            const res = await ImagePicker.openPicker({
                width: 500, // Crop width
                height: 500, // Crop height
                cropping: true, // Enable cropping
                mediaType: "photo", // Only allow photos
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
            if (res && res.path) {
                setThumbnailUri(res.path);
            }
        } catch (err) {
            console.log("Thumbnail picking cancelled or failed:", err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
            {videoUri && (
                <VideoCard
                    video={videoUri}
                    thumbnail={thumbnailUri}
                    onPress={() => console.log("Play video")}
                    onRemove={() => {
                        setVideoUri(null);
                        setThumbnailUri(null);
                    }}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Add a title"
                placeholderTextColor={Colors.WHITE}
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                multiline
                style={styles.input2}
                placeholder="Write a description"
                placeholderTextColor={Colors.WHITE}
                value={description}
                onChangeText={setDescription}
            />

            <Dropdown
                style={styles.dropdown}
                placeholder="Select a category"
                placeholderStyle={styles.placeholder}
                data={VideoCategory}
                labelField="label"
                valueField="value"
                value={category}
                onChange={(item) => setCategory(item.value)}
            />
            <Dropdown
                style={styles.dropdown}
                placeholder="Set visibility"
                placeholderStyle={styles.placeholder}
                data={[
                    { label: "Public", value: "public" },
                    { label: "Private", value: "private" },
                ]}
                labelField="label"
                valueField="value"
                value={visibility}
                onChange={(item) => setVisibility(item.value)}
            />

            {!videoUri && (
                <TouchableOpacity
                    style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
                    onPress={pickVideo}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.WHITE} />
                    ) : (
                        <Text style={styles.buttonText}>Pick Video</Text>
                    )}
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={pickThumbnail}
                style={[
                    styles.button,
                    { opacity: loading ? 0.5 : 1, marginBottom: 30 },
                ]}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.WHITE} />
                ) : (
                    <Text style={styles.buttonText}>
                        {thumbnailUri ? "Change Thumbnail" : "Pick Thumbnail"}
                    </Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}
