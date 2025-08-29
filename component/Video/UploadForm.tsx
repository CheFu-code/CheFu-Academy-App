import { Colors } from "@/constant/Colors";
import { VideoCategory } from "@/constant/Option";
import { UploadFormProps } from "@/types/video";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
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
    duration,
    setDuration,
    views,
    setViews,
    topics,
    setTopics,
}: UploadFormProps) {
    const [newTopic, setNewTopic] = useState("");

    const addTopic = () => {
        const topic = newTopic.trim();
        if (topic && !topics.includes(topic)) {
            setTopics([...topics, topic]);
            setNewTopic("");
        }
    };
    const pickVideo = async () => {
        setLoading(true);
        try {
            const res = await ImagePicker.openPicker({
                mediaType: "video",
                multiple: false,
            });
            if (res && res.path) {
                setVideoUri(res.path);

                const info: any = await createThumbnail({ url: res.path });

                if (info?.duration) {
                    setDuration(Math.floor(info.duration / 1000));
                }
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
                cropping: true, // Enable cropping
                mediaType: "photo", // Only allow photos
                // compressImageMaxWidth: 1024, // Resize image max width
                // compressImageMaxHeight: 1024, // Resize image max height
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
                style={styles.input}
                placeholder="Add a topic"
                placeholderTextColor={Colors.WHITE}
                value={newTopic}
                onChangeText={setNewTopic}
                onSubmitEditing={addTopic}
            />
            {newTopic.trim() && (
                <TouchableOpacity
                    style={[styles.button, { marginVertical: 10 }]}
                    onPress={addTopic}
                >
                    <Text style={styles.buttonText}>Add Topic</Text>
                </TouchableOpacity>
            )}

            {/* {topics.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 20, marginTop: 10 }}
                >
                    {topics.map((t) => (
                        <View key={t} style={styles.topicBadge}>
                            <Text style={styles.topicText}>{t}</Text>
                        </View>
                    ))}
                </ScrollView>
            )} */}
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 20,
                }}
            >
                {topics.map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[
                            styles.topicBadge,
                            {
                                backgroundColor: "green",
                                marginVertical: 3,
                            },
                        ]}
                        onPress={() =>
                            setTopics(topics.filter((topic) => topic !== t))
                        }
                    >
                        <Text style={styles.topicText}>{t} ✕</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                multiline
                style={styles.input2}
                placeholder="Write a description"
                placeholderTextColor={Colors.WHITE}
                value={description}
                onChangeText={setDescription}
            />
            <View style={styles.dropdownContainer}>
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
            </View>

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
