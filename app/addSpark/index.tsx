import Button from '@/component/Shared/Button';
import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { categories, MAX_WORDS } from '@/constant/random';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/AddSpark';
import { showToast } from '@/utils/toast';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import {
    addDoc,
    collection,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import { useContext, useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';

const AddSpark = () => {
    const { userDetail } = useContext(UserDetailContext);
    const { safeBack, safeReplace } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const wordCount =
        content.trim() === '' ? 0 : content.trim().split(/\s+/).length;

    const handlePost = async () => {
        if (!title || !content || !selectedCategory) {
            showToast('Please fill in all fields');
            return;
        }

        const words = content.trim().split(/\s+/);
        if (words.length > MAX_WORDS) {
            showToast(
                `Content too long. Please keep it under ${MAX_WORDS} words (~5 lines).`,
            );
            return;
        }

        try {
            setLoading(true);
            if (!userDetail) {
                showToast('You must be logged in to post a Spark');
                setLoading(false);
                return;
            }

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
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={{ paddingHorizontal: scale(10) }}>
                    <TouchableOpacity
                        onPress={safeBack}
                        style={styles.backButton}
                        disabled={loading}
                    >
                        <AntDesign
                            name="left"
                            size={scale(20)}
                            color={Colors.PRIMARY}
                        />
                        <Text style={styles.heading}>Create a Spark</Text>
                    </TouchableOpacity>

                    <Text style={[styles.label, { color: textColor }]}>
                        Title
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a title for your Spark"
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor={Colors.GRAY}
                    />

                    <Text style={[styles.label, { color: textColor }]}>
                        Content
                    </Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Write something interesting..."
                        multiline
                        numberOfLines={6}
                        value={content}
                        onChangeText={setContent}
                        placeholderTextColor={Colors.GRAY}
                    />

                    <Text
                        style={[
                            styles.wordCount,
                            {
                                color:
                                    wordCount > MAX_WORDS
                                        ? Colors.RED
                                        : Colors.GRAY,
                            },
                        ]}
                    >
                        {wordCount} / {MAX_WORDS} words
                    </Text>
                </View>

                <Text
                    style={[
                        styles.label,
                        {
                            paddingHorizontal: moderateScale(10),
                            color: textColor,
                        },
                    ]}
                >
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
                <View style={{ paddingHorizontal: moderateScale(10) }}>
                    <Button
                        loading={loading}
                        onPress={handlePost}
                        text={'Post Spark'}
                        disabled={
                            loading || !title || !content || !selectedCategory
                        }
                        icon={
                            <MaterialIcons
                                name="post-add"
                                size={scale(19)}
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
