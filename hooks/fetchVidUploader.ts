import { db } from '@/config/firebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';
import { deleteVideo } from '@/services/deleteVideo';
import { reportVideo } from '@/services/reportVideo';
import { Video } from '@/types/video';
import { showToast } from '@/utils/toast';
import {
    deleteDoc,
    doc,
    getDoc,
    increment,
    serverTimestamp,
    setDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeNavigation } from './useSafeNavigation';

export const useFetchVideoUploader = () => {
    const { userDetail } = useContext(UserDetailContext);
    const { safeReplace } = useSafeNavigation();
    const [video, setVideo] = useState<Video | null>(null);
    const [adding, setAdding] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [uploaderName, setUploaderName] = useState<string | null>(null);
    const [reportReason, setReportReason] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);

    const fetchUploaderName = async () => {
        if (!video?.uploadedBy) return;

        const userRef = doc(db, 'users', video.uploadedBy);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            setUploaderName(data?.fullname ?? video.uploadedBy);
        } else {
            setUploaderName(video.uploadedBy); // fallback to email
        }
    };

    const handleEnroll = async () => {
        setEnrolling(true);
        if (!userDetail) {
            showToast('Please log in to enroll.');
            setEnrolling(false);
            return;
        }
        if (!video) {
            setEnrolling(false);
            return;
        }

        try {
            // user enrollments collection
            const ref = doc(
                db,
                'users',
                userDetail?.email,
                'enrollments',
                video.id,
            );

            await setDoc(ref, {
                videoId: video.id,
                title: video.title,
                thumbnailURL: video.thumbnailURL,
                enrolledAt: serverTimestamp(),
            });

            const videoRef = doc(db, 'videos', video.id);
            await updateDoc(videoRef, {
                views: increment(1),
            });

            setVideo((prev) =>
                prev ? { ...prev, views: (prev.views || 0) + 1 } : prev,
            );

            showToast('You have successfully enrolled');
        } catch (err) {
            console.error('Enrollment failed:', err);
            showToast('Something went wrong while enrolling.');
        } finally {
            setEnrolling(false);
        }
    };

    const handleFavorite = async () => {
        setAdding(true);
        if (!userDetail) {
            showToast('Please log in to add favorites.');
            setAdding(false);
            return;
        }
        if (!video) {
            setAdding(false);
            return;
        }
        if (!video) return;

        try {
            const favRef = doc(
                db,
                'users',
                userDetail?.email,
                'favorites',
                video.id,
            );

            if (favorite) {
                await deleteDoc(favRef);
                setFavorite(false);
                showToast('Removed from favorites.');
            } else {
                await setDoc(favRef, {
                    videoId: video.id,
                    title: video.title,
                    thumbnailURL: video.thumbnailURL,
                    addedAt: serverTimestamp(),
                });
                setFavorite(true);
                showToast('Added to favorites!');
            }
        } catch (err) {
            console.error('Favorite toggle failed:', err);
            showToast('Something went wrong while updating favorites.');
        } finally {
            setAdding(false);
        }
    };

    const handleDownload = async () => {
        if (!video) return;
        if (userDetail.member === false) {
            Alert.alert(
                'Upgrade Required',
                'Only members can download videos. Upgrade now to enjoy offline access and premium features.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Upgrade',
                        onPress: () => safeReplace('/subscription'),
                    },
                ],
            );

            return;
        }

        try {
            setDownloading(true);
            showToast('Downloading...');

            // Request permission to save to gallery (for iOS/Android)
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                showToast('Permission denied to save file.');
                setDownloading(false);
                return;
            }

            // Define local file path
            const fileUri = FileSystem.documentDirectory + `${video.title}.mp4`;

            // Download video
            const { uri } = await FileSystem.downloadAsync(
                video.videoURL,
                fileUri,
            );

            // Save to gallery / camera roll
            await MediaLibrary.createAssetAsync(uri);

            showToast('Video downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            showToast('Failed to download video.');
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteVideo = async () => {
        if (!video) return;

        setDeleting(true);

        await deleteVideo({
            video,
            onSuccess: () => safeReplace('/(tabs)/home'),
            onFinally: () => setDeleting(false),
        });
    };

    const handleReport = async () => {
        if (!video || !userDetail) {
            showToast('Please log in to report this video.');
            return;
        }

        setReporting(true);

        await reportVideo({
            video,
            userEmail: userDetail.email,
            reason: reportReason,
            onSuccess: () => {
                setReportReason('');
                setShowReportModal(false);
            },
            onFinally: () => setReporting(false),
        });
    };

    return {
        video,
        setVideo,
        adding,
        setAdding,
        favorite,
        setFavorite,
        deleting,
        setDeleting,
        reporting,
        setReporting,
        enrolling,
        setEnrolling,
        downloading,
        setDownloading,
        uploaderName,
        setUploaderName,
        reportReason,
        setReportReason,
        showReportModal,
        setShowReportModal,
        fetchUploaderName,
        handleEnroll,
        handleFavorite,
        handleDownload,
        handleDeleteVideo,
        handleReport,
    };
};
