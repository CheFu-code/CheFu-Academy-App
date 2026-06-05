import { Colors } from '@/constant/Colors';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CategorySpark = () => {
    const { category } = useLocalSearchParams();
    const { safeBack } = useSafeNavigation();
    const categoryTitle = Array.isArray(category) ? category[0] : category;
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={safeBack} style={styles.backButton}>
                <AntDesign name="left" color={'white'} size={20} />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text
                accessibilityLabel="category-title"
                style={styles.categoryTitle}
            >
                {categoryTitle || 'Category'}
            </Text>
        </SafeAreaView>
    );
};

export default CategorySpark;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.BG_COLOR },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 10,
    },
    backText: {
        color: 'white',
        fontSize: 16,
    },
    categoryTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'outfit-bold',
        marginTop: 20,
        textAlign: 'center',
    },
});
