import { auth } from '@/config/fireConfig';
import { OFFLINE_DOWNLOADS } from '@/constant/caches';
import {
    ensureLegacyWritePermission,
    savePDFToAppMediaFolder,
    scanFile,
} from '@/helpers/courseDownloadHelpers';
import { generateCourseHTML } from '@/helpers/generateCourseHTML';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import {
    AntDesign,
    MaterialCommunityIcons,
    MaterialIcons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    FlatList,
    Image,
    Platform,
    Pressable,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Chapters from '../../component/CourseView/Chapters';
import Intro from '../../component/CourseView/Intro';
import { Colors } from '../../constant/Colors';
import { imageAssets } from '../../constant/Option';
import { styles } from '../../styles/CourseView';

export default function CourseView() {
    const { courseParams, enroll } = useLocalSearchParams();
    const { safeReplace, safePush } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    const [course, setCourse] = useState<Course>({
        id: '',
        courseTitle: '',
        description: '',
        category: '',
        banner_image: '',
        createdBy: '',
        // createdOn: firestore.Timestamp.fromDate(new Date()),
        chapters: [],
        flashcards: [],
        qa: [],
        quiz: [],
        docId: '',
        enrolled: false,
    });

    const [loading, setLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    useEffect(() => {
        if (
            typeof courseParams === 'string' &&
            courseParams.trim() !== '' &&
            courseParams.trim() !== 'undefined' &&
            (courseParams.trim().startsWith('{') ||
                courseParams.trim().startsWith('['))
        ) {
            try {
                const parsed = JSON.parse(courseParams);
                setCourse(parsed);
            } catch (e) {
                console.error('Failed to parse courseParams:', courseParams, e);
                setCourse({
                    id: '',
                    courseTitle: '',
                    description: '',
                    category: '',
                    banner_image: '',
                    createdBy: '',
                    createdOn: FirebaseFirestoreTypes.Timestamp.fromDate(
                        new Date(),
                    ),
                    chapters: [],
                    flashcards: [],
                    qa: [],
                    quiz: [],
                    docId: '',
                    enrolled: false,
                });
            }
        } else {
            console.warn('courseParams is missing or invalid:', courseParams);
            setCourse({
                id: '',
                courseTitle: '',
                description: '',
                category: '',
                banner_image: '',
                createdBy: '',
                createdOn: FirebaseFirestoreTypes.Timestamp.fromDate(
                    new Date(),
                ),
                chapters: [],
                flashcards: [],
                qa: [],
                quiz: [],
                docId: '',
                enrolled: false,
            });
        }
    }, [courseParams]);

    const downloadCourse = async (course: Course) => {
        if (!course || loading) {
            ToastAndroid.show('No course data to download', ToastAndroid.SHORT);
            return;
        }

        setLoading(true);

        try {
            if (!auth.currentUser?.emailVerified) {
                ToastAndroid.show(
                    'Please verify your email to download courses',
                    ToastAndroid.SHORT,
                );
                setLoading(false);
                return;
            }

            // Load existing downloads
            let existing = await AsyncStorage.getItem(OFFLINE_DOWNLOADS);
            let parsed: Course[] = [];
            try {
                parsed = existing ? JSON.parse(existing) : [];
            } catch {
                parsed = [];
            }

            if (
                parsed.some(
                    (d: any) =>
                        d.courseTitle === course.courseTitle ||
                        d.title === course.courseTitle,
                )
            ) {
                ToastAndroid.show(
                    'Course already downloaded',
                    ToastAndroid.SHORT,
                );
                setDownloaded(true);
                setLoading(false);
                safePush('/download');
                return;
            }

            ToastAndroid.show('Downloading...', ToastAndroid.SHORT);

            // Generate PDF
            const html = generateCourseHTML(course);
            const { uri } = await Print.printToFileAsync({
                html,
                base64: false,
            });
            const fileName =
                (course.courseTitle?.replace(/[^a-z0-9]/gi, '_') || 'course') +
                '.pdf';

            if (Platform.OS === 'android') {
                const permitted = await ensureLegacyWritePermission();
                if (!permitted) {
                    ToastAndroid.show(
                        'Storage permission denied',
                        ToastAndroid.SHORT,
                    );
                    setLoading(false);
                    return;
                }

                const destPath = await savePDFToAppMediaFolder(uri, fileName);

                scanFile(destPath);

                const updated = [
                    ...parsed,
                    {
                        id: Date.now().toString(),
                        title: course.courseTitle,
                        description: course.description,
                        uri: destPath,
                    },
                ];
                await AsyncStorage.setItem(
                    OFFLINE_DOWNLOADS,
                    JSON.stringify(updated),
                );

                ToastAndroid.show('Downloaded...', ToastAndroid.SHORT);
            } else {
                const destPath = `${FileSystem.documentDirectory}${fileName}`;
                await FileSystem.copyAsync({ from: uri, to: destPath });

                const updated = [
                    ...parsed,
                    {
                        id: Date.now().toString(),
                        title: course.courseTitle,
                        description: course.description,
                        uri: destPath,
                    },
                ];
                await AsyncStorage.setItem(
                    OFFLINE_DOWNLOADS,
                    JSON.stringify(updated),
                );
                ToastAndroid.show(
                    'Downloaded in app storage',
                    ToastAndroid.SHORT,
                );
            }

            setDownloaded(true);
            safePush('/download');
        } catch (err) {
            ToastAndroid.show('Download failed', ToastAndroid.SHORT);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (downloaded) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.3,
                        duration: 300,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.in(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        } else {
            scaleAnim.stopAnimation();
            scaleAnim.setValue(1); // reset if not downloaded
        }
    }, [downloaded, scaleAnim]);

    useEffect(() => {
        const checkDownloadStatus = async () => {
            const existing = await AsyncStorage.getItem('offlineDownloads');
            const parsed = existing ? JSON.parse(existing) : [];
            const isDownloaded = parsed.some(
                (d: Course) => d.courseTitle === course.courseTitle,
            );
            setDownloaded(isDownloaded);
        };

        if (course?.courseTitle) checkDownloadStatus();
    }, [course]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Image
                source={
                    imageAssets[course.banner_image as keyof typeof imageAssets]
                }
                style={styles.image}
            />

            <TouchableOpacity
                disabled={loading}
                onPress={() => safeReplace('/(tabs)/home')}
                style={styles.backButton}
            >
                <AntDesign size={scale(20)} color={textColor} name="left" />
                <Text style={[styles.backText, { color: textColor }]}>
                    Back
                </Text>
            </TouchableOpacity>

            {auth.currentUser?.emailVerified ? (
                <Pressable
                    disabled={loading}
                    onPress={() => downloadCourse(course)}
                    style={styles.downloadButton}
                >
                    {loading ? (
                        <ActivityIndicator
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            size={'small'}
                            color={'white'}
                        />
                    ) : downloaded ? (
                        <TouchableOpacity
                            onPress={() => {
                                ToastAndroid.show(
                                    'Already downloaded',
                                    ToastAndroid.SHORT,
                                );
                            }}
                        >
                            <Animated.View
                                style={{ transform: [{ scale: scaleAnim }] }}
                            >
                                <MaterialIcons
                                    name="download-done"
                                    size={scale(22)}
                                    color="white"
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    ) : (
                        <MaterialIcons
                            name="file-download"
                            size={scale(22)}
                            color="white"
                        />
                    )}
                </Pressable>
            ) : (
                <Pressable
                    disabled={loading}
                    onPress={() => downloadCourse(course)}
                    style={[
                        styles.downloadButton,
                        { backgroundColor: Colors.LIGHT_RED },
                    ]}
                >
                    <MaterialCommunityIcons
                        style={{ marginTop: verticalScale(-1) }}
                        size={scale(22)}
                        color={Colors.RED}
                        name="download-off-outline"
                    />
                </Pressable>
            )}

            {/* Spacer below the image */}
            <View style={{ height: verticalScale(220) }} />

            {/* Scrollable content below */}
            <FlatList
                data={[]}
                showsVerticalScrollIndicator={false}
                renderItem={() => null}
                ListHeaderComponent={
                    <View>
                        <Intro
                            course={course}
                            enroll={Array.isArray(enroll) ? enroll[0] : enroll}
                        />
                        <Chapters course={course} />
                    </View>
                }
            />
        </View>
    );
}
