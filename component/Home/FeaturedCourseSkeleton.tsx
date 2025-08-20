import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const Shimmer = ({ style }: { style: any }) => {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-300, 300],
    });

    return (
        <View style={[style, styles.shimmerContainer]}>
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    );
};

export default function FeaturedCourseSkeleton() {
    return (
        <View style={styles.container}>
            <Shimmer style={styles.banner} />
            <View style={styles.infoContainer}>
                <Shimmer style={styles.title} />
                <Shimmer style={styles.category} />
                <View style={styles.detailsContainer}>
                    <Shimmer style={styles.detailItem} />
                    <Shimmer style={styles.detailItem} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 280,
        backgroundColor: "#2c3e50",
        borderRadius: 15,
        marginHorizontal: 10,
        overflow: "hidden",
    },
    banner: {
        width: "100%",
        height: 150,
        backgroundColor: "#34495e",
    },
    infoContainer: {
        padding: 15,
    },
    title: {
        width: "80%",
        height: 20,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: "#34495e",
    },
    category: {
        width: "40%",
        height: 16,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: "#34495e",
    },
    detailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#34495e",
        paddingTop: 10,
    },
    detailItem: {
        width: "45%",
        height: 14,
        borderRadius: 4,
        backgroundColor: "#34495e",
    },
    shimmerContainer: {
        overflow: "hidden",
    },
    shimmer: {
        width: "50%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        position: "absolute",
    },
});