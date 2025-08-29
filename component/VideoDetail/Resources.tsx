import { Video } from "@/types/video";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/Resources.styles";

type Props = {
    video?: Video | null;
};

// Dummy video data
const dummyVideo: Video = {
    id: "1",
    title: "React Native Crash Course",
    description: "Learn React Native from scratch.",
    resources: [
        { name: "Lecture Slides", url: "https://example.com/slides.pdf" },
        { name: "Code Examples", url: "https://example.com/code.zip" },
        { name: "Reference PDF", url: "https://example.com/reference.pdf" },
    ],
};

export default function Resources({ video }: Props) {
    const currentVideo =  dummyVideo; // use dummy if no video passed

    const handleDownload = (url: string) => {
        Linking.openURL(url).catch(() => {
            alert("Failed to open resource.");
        });
    };

    if (!currentVideo.resources || currentVideo.resources.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Resources</Text>
                <Text style={styles.noResources}>
                    No resources available for this video.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resources</Text>
            <FlatList
                data={currentVideo.resources}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resourceItem}>
                        <Text style={styles.resourceName}>{item.name}</Text>
                        <TouchableOpacity
                            onPress={() => handleDownload(item.url)}
                        >
                            <AntDesign
                                name="download"
                                size={24}
                                color="#007BFF"
                            />
                        </TouchableOpacity>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}
