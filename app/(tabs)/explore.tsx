import ListFooter from '@/component/ListFooter';
import Loading from '@/component/Shared/Loading';
import { CACHED_COURSES } from '@/constant/caches';
import { courseRef } from '@/constant/random';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useSearchHandler } from '@/hooks/useSearch';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    FirebaseFirestoreTypes,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from '@react-native-firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Text,
    TextInput,
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
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { backgroundColor } = useDarkMode();
    const [searchTerm, setSearchTerm] = useState('');
    const { handleSearch } = useSearchHandler({
        searchTerm,
        setSearchTerm,
        safePush,
    });

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [courseData, setCourseData] = useState<Course[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const isSearching = searchTerm.trim().length > 0;

    const fetchCourses = useCallback(async () => {
        setRefreshing(true);
        setLoading(true);
        setLastDoc(null);
        setHasMore(true);

        try {
            const q = query(courseRef, orderBy('createdOn', 'desc'), limit(6));
            const snapshot = await getDocs(q);

            let data: Course[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                }),
            );

            data = data.filter(
                (course) => course.createdBy !== userDetail?.email,
            );

            setCourseData(data);
            setFilteredCourses(data);

            setHasMore(snapshot.docs.length === 6);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);

            await AsyncStorage.setItem(CACHED_COURSES, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            const cached = await AsyncStorage.getItem(CACHED_COURSES);
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

    const loadMore = async () => {
        if (loadingMore || !lastDoc || !hasMore) return;

        setLoadingMore(true);

        try {
            const q = query(
                courseRef,
                orderBy('createdOn', 'desc'),
                startAfter(lastDoc),
                limit(7),
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setHasMore(false);
                setLastDoc(null);
                return;
            }

            const data: Course[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                }),
            );

            setCourseData((prev) => [...prev, ...data]);
            setFilteredCourses((prev) => [...prev, ...data]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

            if (snapshot.docs.length < 7) {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading && courseData.length === 0) {
        return <Loading />;
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
                    onRefresh={fetchCourses}
                    refreshing={refreshing}
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{
                        paddingBottom: moderateScale(30),
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
                    onEndReached={isSearching ? undefined : loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={loadingMore ? <ListFooter /> : null}
                />
            </View>
        </SafeAreaView>
    );
}
