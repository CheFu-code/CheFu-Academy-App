// VideoCard.tsx
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Video from "react-native-video";

const { width } = Dimensions.get("window");

type VideoCardProps = {
    video?: string | null;
    thumbnail?: string | null;
    onPress: () => void; // For playing video
    onRemove: () => void; // For canceling/removing video
};

export default function VideoCard({
    video,
    thumbnail,
    onPress,
    onRemove,
}: VideoCardProps) {
    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity style={styles.card} onPress={onPress}>
                {thumbnail ? (
                    <Image
                        source={{ uri: thumbnail }}
                        style={styles.video}
                        resizeMode="contain"
                    />
                ) : video ? (
                    <Video
                        source={{ uri: video }}
                        style={styles.video}
                        resizeMode="contain"
                        controls
                    />
                ) : (
                    <View style={[styles.video, styles.placeholder]}>
                        <AntDesign name="playcircleo" size={50} color="#888" />
                        <Text style={styles.placeholderText}>Preview</Text>
                    </View>
                )}
                <Text style={styles.text}>Preview</Text>
            </TouchableOpacity>

            {/* Cross icon */}
            <TouchableOpacity style={styles.crossIcon} onPress={onRemove}>
                <AntDesign name="closecircle" size={25} color="red" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        position: "relative",
        marginVertical: 10,
        alignItems: "center",
    },
    card: {
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#222",
        alignItems: "center",
    },
    video: {
        width: width - 40,
        height: 200,
        borderRadius: 10,
    },
    text: {
        color: "#fff",
        marginTop: 5,
        fontSize: 14,
        fontFamily: "outfit",
    },
    placeholder: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#444",
    },
    placeholderText: {
        color: "#888",
        marginTop: 5,
    },
    crossIcon: {
        position: "absolute",
        top: 10,
        right: 15,
        zIndex: 10,
    },
});
