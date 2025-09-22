import { Colors } from "@/constant/Colors";
import { formatDuration } from "@/helpers/formatDateVideoCard";
import {
    fetchVideos,
    fetchYouTubeVideos,
    formatYouTubeDuration,
} from "@/services/videoService";
import { Video } from "@/types/video";
import {
    AntDesign,
    FontAwesome5,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/VideoCardHomeScreen.styles";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";
import { formatViews } from "@/utils/formatViews";
import { parseYouTubeDuration } from "@/helpers/formatDate";

const STORAGE_KEY = "videos_cache";

export default function VideoCardHomeScreen() {
    const { safePush } = useSafeNavigation();
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    dayjs.extend(relativeTime);

    useEffect(() => {
        loadCachedVideos();
        fetchAndUpdateVideos();
    }, []);

    const loadCachedVideos = async () => {
        try {
            const cached = await AsyncStorage.getItem(STORAGE_KEY);
            if (cached) {
                setVideos(JSON.parse(cached));
            }
        } catch (err) {
            console.warn("Failed to load cache:", err);
        }
    };

    useEffect(() => {
        const loadVideos = async () => {
            try {
                const backendVideos = await fetchVideos();
                const ytVideos = await fetchYouTubeVideos();

                const ytVideosMapped: Video[] = ytVideos.map((v) => ({
                    id: v.videoId, // Video requires 'id'
                    title: v.title,
                    thumbnailURL: v.thumbnailURL,
                    description: v.description,
                    duration: parseYouTubeDuration(v.duration),
                    views: v.views,
                    publishedAt: v.publishedAt,
                    category: "YouTube",
                    uploadedAt: v.createdAt, // Video requires 'uploadedAt'
                    instructorName: v.channelTitle || "Unknown Channel",
                    instructorCompany: v.channelTitle
                        ? `${v.channelTitle} Productions`
                        : "",
                    videoURL: "", // keep empty for YouTube
                    uploadedBy: "YouTube",
                    level: "beginner",
                    topics: [],
                    visibility: "public",
                }));

                const allVideos = [...backendVideos, ...ytVideosMapped];
                setVideos(allVideos);

                await AsyncStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(allVideos)
                );
            } catch (err) {
                console.warn("Failed to load videos:", err);
            }
        };

        loadVideos();
    }, []);

    const fetchAndUpdateVideos = async () => {
        try {
            const fetched = await fetchVideos();
            setVideos(fetched);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fetched));
        } catch (err) {
            console.warn("Failed to fetch videos:", err);
        }
    };

    const handleCategoryPress = useCallback(
        (category: string) => {
            setSelectedCategory(category);
            safePush({
                pathname: "/searchResults",
                params: { query: category },
            });
        },
        [setSelectedCategory, safePush]
    );

    const renderVideoCard = ({ item }: { item: Video }) => (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => {
                safePush({
                    pathname: "/videoDetail",
                    params:
                        item.uploadedBy === "YouTube"
                            ? { ytVideo: JSON.stringify(item) }
                            : { id: item.id },
                });
            }}
        >
            <View style={styles.card}>
                {item.thumbnailURL && (
                    <Image
                        source={{ uri: item.thumbnailURL }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                )}
            </View>
            <Text numberOfLines={2} style={styles.title}>
                {item.title}
            </Text>
            <Text numberOfLines={3} style={styles.description}>
                {item.description}
            </Text>
            <TouchableOpacity
                onPress={() => handleCategoryPress(item.category)}
                style={styles.category}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <Text style={styles.categoryText}>{item.category}</Text>
                    {item.category === "YouTube" && (
                        <AntDesign name="youtube" color={"red"} size={15} />
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.durationContainer}>
                <Text style={styles.uploadedAt}>
                    {item.uploadedBy !== "YouTube"
                        ? item.uploadedAt && "toDate" in item.uploadedAt
                            ? dayjs(item.uploadedAt.toDate()).fromNow()
                            : "Just now"
                        : item.uploadedBy}
                </Text>
                <View style={[styles.durationInfo, { left: 40 }]}>
                    <AntDesign
                        name="clockcircleo"
                        size={14}
                        color={Colors.BLACK}
                    />
                    <Text style={styles.duration}>
                        {typeof item.duration === "string"
                            ? formatYouTubeDuration(item.duration)
                            : formatDuration(item.duration)}{" "}
                    </Text>
                </View>
                <View style={[styles.durationInfo, { maxWidth: 100 }]}>
                    <FontAwesome5 name="users" size={14} color={Colors.BLACK} />
                    <Text numberOfLines={1} style={styles.duration}>
                        {formatViews(item.views)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={videos}
            keyExtractor={(item, index) => item.id ?? index.toString()}
            renderItem={renderVideoCard}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
}
