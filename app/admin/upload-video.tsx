import UploadForm from "@/component/Video/UploadForm";
import { Colors } from "@/constant/Colors";
import { uploadVideo } from "@/services/videoService";
import { showToast } from "@/utils/toast";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import { styles } from "../../styles/UploadVideo.styles";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export default function UploadVideo() {
    const { safeBack,safeReplace } = useSafeNavigation()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string | null>(null);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [visibility, setVisibility] = useState<"public" | "private" | null>(
        null
    );
    const [duration, setDuration] = useState<number>(0); // <-- NEW
    const [topics, setTopics] = useState<string[]>([]);
    const [views, setViews] = useState<number>(0);

    const handleUpload = async () => {
        if (
            !title ||
            !description ||
            !videoUri ||
            !thumbnailUri ||
            !category ||
            !visibility ||
            topics.length === 0
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
                visibility,
                duration,
                0,
                topics
            );
            showToast("Video uploaded successfully!");
            safeReplace("/(tabs)/home");
        } catch (err: any) {
            console.error(err);
            showToast("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleVideoPicked = (uri: string | null) => {
        setVideoUri(uri);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={safeBack}
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
                setVideoUri={handleVideoPicked}
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
                duration={duration}
                setDuration={setDuration}
                views={0} // ✅ add this
                setViews={setViews}
                topics={topics} // ✅ add this
                setTopics={setTopics}
            />
            {videoUri && (
                <Video
                    source={{ uri: videoUri }}
                    style={{ width: 0, height: 0 }}
                    paused={true}
                    onLoad={(data) => setDuration(data.duration)}
                    onError={(err) => console.error("Video error:", err)}
                />
            )}

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
