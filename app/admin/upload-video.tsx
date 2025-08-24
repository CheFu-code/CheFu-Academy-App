import UploadForm from "@/component/Video/UploadForm";
import { Colors } from "@/constant/Colors";
import { uploadVideo } from "@/services/videoService";
import { showToast } from "@/utils/toast";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/UploadVideo.styles";

export default function UploadVideo() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string | null>(null);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [visibility, setVisibility] = useState<string | null>(null);

    const handleUpload = async () => {
        if (
            !title ||
            !description ||
            !videoUri ||
            !thumbnailUri ||
            !category ||
            !visibility
        ) {
            showToast("All fields are required!");
            return;
        }
        try {
            setLoading(true);
            await uploadVideo(
                title,
                description,
                videoUri,
                thumbnailUri,
                category,
                visibility
            );
            showToast("Video uploaded successfully!");
            router.back();
        } catch (err: any) {
            console.error(err);
            showToast("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <AntDesign name="left" size={24} color={Colors.WHITE} />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.header}>Upload Video</Text>
            </View>

            <UploadForm
                videoUri={videoUri}
                setVideoUri={setVideoUri}
                thumbnailUri={thumbnailUri}
                setThumbnailUri={setThumbnailUri}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                category={category}
                setCategory={setCategory}
                visibility={visibility}
                setVisibility={setVisibility}
                loading={loading}
                setLoading={setLoading}
            />

            <View style={styles.uploadButtonContainer}>
                <TouchableOpacity
                    style={[
                        styles.uploadButton,
                        { opacity: loading ? 0.5 : 1 },
                    ]}
                    onPress={handleUpload}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.WHITE} />
                    ) : (
                        <Text style={styles.buttonText}>Upload</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
