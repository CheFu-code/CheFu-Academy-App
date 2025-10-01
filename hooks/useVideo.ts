import { Course } from "@/types/course";
import { Video } from "@/types/video";
import { collection, FirebaseFirestoreTypes, getDocs, getFirestore } from "@react-native-firebase/firestore";
import { useCallback, useState } from "react";

export const useVideo = () => {
    const [results, setResults] = useState<Course[]>([]);
    const [videoResults, setVideoResults] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();

    const fetchCourses = useCallback(
        async (query: string | string[]) => {
            try {
                const term = Array.isArray(query) ? query[0] : query || '';

                const snapshot = await getDocs(collection(db, 'course'));

                const filtered: Course[] = snapshot.docs
                    .map(
                        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                docId: doc.id,
                                courseTitle:
                                    data.courseTitle || data.title || '',
                                category: data.category,
                                banner_image: data.banner_image,
                                chapters: data.chapters,
                                flashcards: data.flashcards,
                                qa: data.qa,
                                quiz: data.quiz,
                                description: data.description,
                                price: data.price,
                                createdBy: data.createdBy,
                                createdOn: data.createdOn,
                                enrolled: data.enrolled,
                            };
                        },
                    )
                    .filter(
                        (course: Course) =>
                            course.courseTitle
                                ?.toLowerCase()
                                .includes(term.toLowerCase()) ||
                            course.category
                                ?.toLowerCase()
                                .includes(term.toLowerCase()),
                    );

                setResults(filtered);
            } catch (e) {
                console.error('Search error:', e);
            } finally {
                setLoading(false);
            }
        },
        [db],
    );

    const fetchVideos = useCallback(
        async (query: string | string[]) => {
            try {
                const term = Array.isArray(query) ? query[0] : query || '';

                const snapshot = await getDocs(collection(db, 'videos'));

                const filtered: Video[] = snapshot.docs
                    .map(
                        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                docId: doc.id,
                                title: data.title || '',
                                category: data.category,
                                thumbnailURL: data.thumbnailURL,
                                videoURL: data.videoURL,
                                views: data.views,
                                duration: data.duration,
                                instructorCompany: data.instructorCompany,
                                instructorName: data.instructorName,
                                description: data.description,
                                level: data.level,
                                uploadedBy: data.uploadedBy,
                                uploadedAt: data.uploadedAt,
                                topics: data.topics,
                            };
                        },
                    )
                    .filter(
                        (video: Video) =>
                            video.title
                                ?.toLowerCase()
                                .includes(term.toLowerCase()) || // ✅ use videoTitle
                            video.category
                                ?.toLowerCase()
                                .includes(term.toLowerCase()),
                    );

                setVideoResults(filtered);
            } catch (e) {
                console.error('Search error:', e);
            } finally {
                setLoading(false);
            }
        },
        [db],
    );

    return { videoResults, fetchVideos, results, fetchCourses, loading, setLoading };
}