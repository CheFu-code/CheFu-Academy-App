import Loading from '@/component/Explore/Loading';
import { db } from '@/config/fireConfig';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    orderBy,
    query,
} from '@react-native-firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CourseCard from '../../component/Shared/CourseCard';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/Explore.styles';

export default function ExploreScreen() {
    const { userDetail } = useContext(UserDetailContext);
    const [courseData, setCourseData] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { backgroundColor } = useDarkMode();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { safePush } = useSafeNavigation();
    const fetchCourses = useCallback(async () => {
        setRefreshing(true);
        try {
            const q = query(
                collection(db, 'course'),
                orderBy('createdOn', 'desc'),
            );
            const snapshot = await getDocs(q);

            let data: Course[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                }),
            );

            // ✅ Exclude courses owned by current user
            data = data.filter(
                (course) => course.createdBy !== userDetail?.email,
            );

            const limitedData = data.slice(0, Math.ceil(data.length * 0.4)); // 40%

            setCourseData(limitedData);
            setFilteredCourses(limitedData);
            await AsyncStorage.setItem(
                'cachedCourses',
                JSON.stringify(limitedData),
            );
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            const cached = await AsyncStorage.getItem('cachedCourses');
            if (cached) {
                const parsed = JSON.parse(cached);
                setCourseData(parsed);
                setFilteredCourses(parsed);
            }
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [userDetail?.email]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            ToastAndroid.show('Please enter a search term', ToastAndroid.SHORT);
            return;
        }

        safePush({
            pathname: '/searchResults',
            params: { query: searchTerm.trim() },
        });
        setSearchTerm('');
    };

    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <Image
                source={require('../../assets/images/graph.png')}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: verticalScale(500),
                }}
            />
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>Explore courses</Text>
            </View>

            <View style={styles.p}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Search course, topic, category..."
                        placeholderTextColor={Colors.GRAY}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={handleSearch}
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                    />
                    <TouchableOpacity onPress={() => handleSearch()}>
                        <Ionicons
                            name="search"
                            size={scale(20)}
                            color={Colors.BLACK}
                            style={{ marginRight: moderateScale(8) }}
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{
                        paddingBottom: moderateScale(50),
                    }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => (
                        <CourseCard
                            course={item}
                            enroll={true}
                            style={{
                                width: '48%',
                                marginBottom: moderateScale(10),
                            }}
                        />
                    )}
                    ListEmptyComponent={
                        <Text
                            style={{
                                textAlign: 'center',
                                marginTop: verticalScale(20),
                                color: '#999',
                            }}
                        >
                            No courses found.
                        </Text>
                    }
                    refreshing={loading}
                    onRefresh={fetchCourses}
                />
            </View>
        </SafeAreaView>
    );
}
