import Button from '@/component/Shared/Button';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/AddSpark';
import { showToast } from '@/utils/toast';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import React, { useContext, useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
    'Tips',
    'Questions',
    'Projects',
    'Resources',
    'Achievements',
    'Discussion',
];

const AddSpark = () => {
    const { userDetail } = useContext(UserDetailContext);
    const { safeBack, safeReplace } = useSafeNavigation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handlePost = async () => {
        if (!title || !content || !selectedCategory) {
            showToast('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (!userDetail) {
                showToast('You must be logged in to post a Spark');
                setLoading(false);
                return;
            }

            const db = getFirestore();

            await addDoc(collection(db, 'sparks'), {
                title,
                content,
                category: selectedCategory,
                createdBy: {
                    uid: userDetail?.uid,
                    email: userDetail?.email,
                    fullname: userDetail?.fullname,
                    profilePicture: userDetail?.profilePicture,
                },
                createdAt: serverTimestamp(),
                likes: [],
                comments: [],
            });

            showToast('Spark posted successfully!');
            safeReplace('/(tabs)/home');
            setTitle('');
            setContent('');
            setSelectedCategory('');
        } catch (error) {
            console.log('Error posting Spark:', error);
            showToast('Failed to post. Please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={{ paddingHorizontal: 10 }}>
                    <TouchableOpacity
                        onPress={safeBack}
                        style={styles.backButton}
                        disabled={loading}
                    >
                        <AntDesign name="left" size={20} color={Colors.WHITE} />
                        <Text style={styles.heading}>Create a Spark</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a title for your Spark"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>Content</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Write something interesting..."
                        multiline
                        numberOfLines={6}
                        value={content}
                        onChangeText={setContent}
                    />
                </View>

                <Text style={[styles.label, { paddingHorizontal: 10 }]}>
                    Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryButton,
                                selectedCategory === cat &&
                                    styles.categorySelected,
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === cat &&
                                        styles.categoryTextSelected,
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={{ paddingHorizontal: 10 }}>
                    <Button
                        opacity={loading ? 0.5 : 1}
                        loading={loading}
                        onPress={handlePost}
                        text={'Post Spark'}
                        disabled={
                            loading || !title || !content || !selectedCategory
                        }
                        icon={
                            <MaterialIcons
                                name="post-add"
                                size={20}
                                color={'white'}
                            />
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddSpark;
