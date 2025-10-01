import { db } from '@/config/fireConfig';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { AntDesign } from '@expo/vector-icons';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    orderBy,
    query,
    where
} from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import CourseListGrid, {
    AllowedPaths,
} from '../../../component/PracticeScreen/CourseListGrid';
import { Colors } from '../../../constant/Colors';
import { PracticeOption } from '../../../constant/Option';
import { UserDetailContext } from '../../../context/UserDetailContext';

export default function PracticeTypeHomeScreen() {
    const { type } = useLocalSearchParams();
    const { safeBack } = useSafeNavigation();
    const option = PracticeOption.find((item) => item.name === type);
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [courseList, setCourseList] = useState<Course[]>([]);

    const GetCourseList = useCallback(async () => {
        setLoading(true);
        setCourseList([]);

        try {
            const q = query(
                collection(db, 'course'),
                where('createdBy', '==', userDetail?.email),
                orderBy('createdOn', 'desc'),
            );
            const querySnapshot = await getDocs(q);
            const courses: Course[] = [];

            querySnapshot.forEach(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                    const courseData = doc.data() as Course; // assert type here
                    courses.push({ ...courseData, id: doc.id });
                },
            );

            setCourseList(courses);
        } catch (e) {
            console.error('❌ Error fetching course list:', e);
        } finally {
            setLoading(false);
        }
    }, [userDetail?.email]);
    useEffect(() => {
        if (userDetail) {
            GetCourseList();
        }
    }, [userDetail, GetCourseList]);

    return (
        <>
            <SafeAreaView
                style={{
                    backgroundColor: Colors.BG_COLOR,
                    paddingBottom: -25,
                }}
            >
                <Image
                    style={{
                        height: 250,
                        width: '100%',
                        borderBottomRightRadius: 25,
                        borderBottomLeftRadius: 25,
                    }}
                    source={option?.image}
                />
                <TouchableOpacity
                    onPress={() => safeBack()}
                    style={{
                        position: 'absolute',
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                    }}
                >
                    <AntDesign name="left" size={24} color={Colors.PRIMARY} />
                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: RFValue(20),
                            color: Colors.PRIMARY,
                        }}
                    >
                        {type}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                showsVerticalScrollIndicator={false}
                onRefresh={() => GetCourseList()}
                refreshing={loading}
                style={{
                    backgroundColor: Colors.BG_COLOR,
                    flex: 1,
                }}
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    <View style={{ flex: 1 }}>
                        {option && (
                            <CourseListGrid
                                option={{
                                    ...option,
                                    path: option.path as AllowedPaths,
                                }}
                                courseList={courseList}
                            />
                        )}
                    </View>
                }
            />
        </>
    );
}
