import { Colors } from "@/constant/Colors";
import { formatDuration } from "@/helpers/formatDateVideoCard";
import { fetchVideos } from "@/services/videoService";
import { Video } from "@/types/video";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/VideoCardHomeScreen.styles";

const STORAGE_KEY = "videos_cache";

export default function VideoCardHomeScreen() {
    const router = useRouter();
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
            console.log("Loaded videos from cache");
        } catch (err) {
            console.warn("Failed to load cache:", err);
        }
    };

    // Fetch new data and update cache
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
            router.push({
                pathname: "/searchResults",
                params: { query: category },
            });
        },
        [router]
    );

    const renderVideoCard = ({ item }: { item: Video }) => (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() =>
                router.push({
                    pathname: "/videoDetail",
                    params: { id: item.id },
                })
            }
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
                <Text style={styles.categoryText}>{item.category}</Text>
            </TouchableOpacity>

            <View style={styles.durationContainer}>
                <Text style={styles.uploadedAt}>
                    {item.uploadedAt && "toDate" in item.uploadedAt
                        ? dayjs(item.uploadedAt.toDate()).fromNow()
                        : "Just now"}
                </Text>
                <View style={[styles.durationInfo, { left: 40 }]}>
                    <AntDesign
                        name="clockcircleo"
                        size={14}
                        color={Colors.BLACK}
                    />
                    <Text style={styles.duration}>
                        {formatDuration(item.duration)}
                    </Text>
                </View>
                <View style={[styles.durationInfo, { maxWidth: 100 }]}>
                    <FontAwesome5 name="users" size={14} color={Colors.BLACK} />
                    <Text numberOfLines={1} style={styles.duration}>
                        {item.views}
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
