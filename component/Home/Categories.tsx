import { Colors } from "@/constant/Colors";
import { categories } from "@/data/categories";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Categories() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const router = useRouter();

    const handleCategoryPress = useCallback(
        (category: string) => {
            setSelectedCategory(category);
            router.push({
                pathname: "/searchResults",
                params: {
                    query: category === "All" ? "" : category,
                    title: `${category} Courses`,
                },
            });
        },
        [router]
    );

    const handleViewAll = useCallback(() => {
        // This can navigate to a dedicated screen for all categories later
        router.push({
            pathname: "/searchResults",
            params: { query: "", title: "All Categories" },
        });
    }, [router]);

    const renderCategoryChip = (item: string) => {
        const isSelected = selectedCategory === item;
        return (
            <TouchableOpacity
                key={item}
                style={[
                    styles.chip,
                    isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}
                onPress={() => handleCategoryPress(item)}
            >
                <Text
                    style={[
                        styles.chipText,
                        isSelected
                            ? styles.chipTextSelected
                            : styles.chipTextUnselected,
                    ]}
                >
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Categories</Text>
                <TouchableOpacity onPress={handleViewAll}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.chipContainer}>
                {categories.map(renderCategoryChip)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    heading: {
        fontFamily: "outfit-bold",
        fontSize: 25,
        color: Colors.PRIMARY,
    },
    viewAll: {
        fontFamily: "outfit",
        color: Colors.PRIMARY,
        fontSize: 16,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    chip: {
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipSelected: {
        backgroundColor: Colors.PRIMARY,
        borderColor: Colors.PRIMARY,
    },
    chipUnselected: {
        backgroundColor: "transparent",
        borderColor: Colors.GRAY,
    },
    chipText: {
        fontFamily: "outfit",
        fontSize: 14,
    },
    chipTextSelected: {
        color: Colors.WHITE,
    },
    chipTextUnselected: {
        color: Colors.GRAY,
    },
});
