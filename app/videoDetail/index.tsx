import NotFound from '@/component/VideoDetail/NotFound';
import OverView from '@/component/VideoDetail/OverView';
import Reviews from '@/component/VideoDetail/Reviews';
import VideoDetailUI from '@/component/VideoDetail/VideoDetailUI';
import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { deleteVideo } from '@/services/deleteVideo';
import { reportVideo } from '@/services/reportVideo';
import { fetchVideoById } from '@/services/videoService';
import { styles } from '@/styles/VideoDetail.styles';
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
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

export default function VideoDetail() {
    const { safeReplace, safeBack } = useSafeNavigation();
    const { id, ytVideo } = useLocalSearchParams();
    const { userDetail } = useContext(UserDetailContext);
    const { textColor, backgroundColor } = useDarkMode();
    const [video, setVideo] = useState<Video | null>(null);
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favorite, setFavorite] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [uploaderName, setUploaderName] = useState<string | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const uploadedAtText = video?.uploadedAt?.toDate().toLocaleDateString();

    const [activeTab, setActiveTab] = useState<
        | 'Overview'
        // "Resources" |
        | 'Reviews'
    >('Overview');

    const [showDeleteModal, setShowDeleteModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverView video={video} />;
            // case "Resources":
            // return <Resources video={video} />;
            case 'Reviews':
                return <Reviews video={video} enrolled={enrolled} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (ytVideo) {
            setVideo(JSON.parse(ytVideo as string));
            setLoading(false);
        } else if (id) {
            fetchVideoById(id as string)
                .then((data) => setVideo(data))
                .finally(() => setLoading(false));
        }
    }, [id, ytVideo]);

    useEffect(() => {
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

        fetchUploaderName();
    }, [video]);

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

    useEffect(() => {
        if (!userDetail || !video) return;
        const ref = doc(
            db,
            'users',
            userDetail?.email,
            'enrollments',
            video.id,
        );
        getDoc(ref).then((docSnap) => {
            if (docSnap.exists()) setEnrolled(true);
        });
    }, [video, userDetail]);

    useEffect(() => {
        if (!userDetail || !video) return;
        const favRef = doc(
            db,
            'users',
            userDetail?.email,
            'favorites',
            video.id,
        );
        getDoc(favRef).then((docSnap) => {
            if (docSnap.exists()) setFavorite(true);
        });
    }, [video, userDetail]);

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

    if (loading) {
        return (
            <ActivityIndicator
                style={styles.loader}
                size="large"
                color={Colors.GREEN}
            />
        );
    }

    if (!video) {
        return <NotFound safeBack={safeBack} />;
    }

    return (
        <VideoDetailUI
            backgroundColor={backgroundColor}
            safeBack={safeBack}
            textColor={textColor}
            video={video}
            adding={adding}
            handleFavorite={handleFavorite}
            favorite={favorite}
            handleDownload={handleDownload}
            downloading={downloading}
            setShowOptions={setShowOptions}
            enrolled={enrolled}
            uploaderName={uploaderName}
            uploadedAtText={uploadedAtText}
            handleEnroll={handleEnroll}
            enrolling={enrolling}
            handleReport={handleReport}
            reporting={reporting}
            reportReason={reportReason}
            setShowReportModal={setShowReportModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            renderTabContent={renderTabContent}
            handleDeleteVideo={handleDeleteVideo}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            userDetail={userDetail}
            showOptions={showOptions}
            showReportModal={showReportModal}
            setReportReason={setReportReason}
        />
    );
}
