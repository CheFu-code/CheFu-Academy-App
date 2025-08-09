import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Topic, TOPICS } from "@/constant/BiologyTopics";
import { Colors } from "@/constant/Colors"; // your color theme
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BiologyExplorer() {
    const [search, setSearch] = useState("");
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const router = useRouter();
    const filteredTopics = TOPICS.filter((topic) =>
        topic.title.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.title.localeCompare(b.title));

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <AntDesign name="left" size={24} color="white" />
                <Text style={styles.title}>Biology Explorer</Text>
            </TouchableOpacity>

            <Text style={styles.numberTopics}>200+ Topics</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredTopics}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.topicCard}
                        onPress={() => setSelectedTopic(item)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.topicTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No topics found.</Text>
                }
            />

            {/* Modal to show topic description */}
            <Modal
                visible={!!selectedTopic}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedTopic(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedTopic?.title}
                        </Text>
                        <Text style={styles.modalDescription}>
                            {selectedTopic?.description}
                        </Text>

                        <Pressable
                            onPress={() => setSelectedTopic(null)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.WHITE,
    },
    topicCard: {
        backgroundColor: "#6a4c93",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    topicTitle: {
        fontSize: 18,
        color: Colors.WHITE,
        fontWeight: "600",
    },
    emptyText: {
        color: Colors.GRAY,
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.BG_COLOR,
        borderRadius: 16,
        padding: 24,
        width: "85%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.WHITE,
        marginBottom: 12,
    },
    modalDescription: {
        fontSize: 16,
        color: Colors.WHITE,
        textAlign: "center",
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#8E44AD",
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 20,
        marginBottom: 10,
    },
    numberTopics: {
        color: "white",
        marginBottom: 10,
        fontFamily: "outfit",
    },
});
