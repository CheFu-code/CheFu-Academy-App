import ListEmpty from '@/component/Shared/ListEmpty';
import ListFooter from '@/component/Shared/ListFooter';
import Loading from '@/component/Shared/Loading';
import useDarkMode from '@/hooks/useDarkMode';
import { usePaginatedCourses } from '@/hooks/usePaginatedCourses';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useSearchHandler } from '@/hooks/useSearch';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
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
import { styles } from '../../styles/Explore.styles';

export default function ExploreScreen() {
    const { safePush } = useSafeNavigation();
    const { backgroundColor } = useDarkMode();
    const [searchTerm, setSearchTerm] = useState('');
    const { handleSearch } = useSearchHandler({
        searchTerm,
        setSearchTerm,
        safePush,
    });
    const {
        courses,
        loading,
        refreshing,
        loadingMore,
        fetchCourses,
        loadMore,
    } = usePaginatedCourses(6);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    if (loading && courses.length === 0) {
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
                    data={courses}
                    refreshing={refreshing}
                    onRefresh={fetchCourses}
                    onEndReached={loadMore}
                    ListFooterComponent={loadingMore ? <ListFooter /> : null}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.3}
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
                    ListEmptyComponent={<ListEmpty />}
                />
            </View>
        </SafeAreaView>
    );
}
