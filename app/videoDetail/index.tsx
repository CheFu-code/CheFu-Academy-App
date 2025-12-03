import AppModal from '@/component/Shared/AppModal';
import Button from '@/component/Shared/Button';
import OverView from '@/component/VideoDetail/OverView';
import Reviews from '@/component/VideoDetail/Reviews';
import { auth, db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { formatDuration } from '@/helpers/formatDateVideoCard';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { fetchVideoById, formatYouTubeDuration } from '@/services/videoService';
import { styles } from '@/styles/VideoDetail.styles';
import { Video } from '@/types/video';
import { formatViews } from '@/utils/formatViews';
import { showToast } from '@/utils/toast';
import {
    AntDesign,
    Feather,
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialIcons,
} from '@expo/vector-icons';
import {
    deleteDoc,
    doc,
    getDoc,
    increment,
    serverTimestamp,
    setDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import {
    deleteObject,
    getStorage,
    refFromURL,
} from '@react-native-firebase/storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video as VideoView } from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function VideoDetail() {
    const { safeReplace, safeBack } = useSafeNavigation();
    const { id, ytVideo } = useLocalSearchParams();
    const { userDetail } = useContext(UserDetailContext);
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
            showToast('Only members can download videos.');
            showToast('Please upgrade your membership.');
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
        if (!auth.currentUser) {
            showToast('You must be logged in to delete video');
            return;
        }

        try {
            setDeleting(true);
            showToast('Deleting video...');

            if (video.uploadedBy === 'YouTube') {
                const docRef = doc(db, 'youTubeVideos', video.id);
                await deleteDoc(docRef);
            } else {
                const storage = getStorage();
                const videoRef = refFromURL(storage, video.videoURL);
                const thumbnailRef = refFromURL(storage, video.thumbnailURL);

                await deleteObject(videoRef);
                await deleteObject(thumbnailRef);

                const docRef = doc(db, 'videos', video.id);
                await deleteDoc(docRef);
            }

            safeReplace('/(tabs)/home');
            showToast('Video deleted successfully!');
        } catch (error) {
            console.error('Delete failed:', error);
            showToast('Failed to delete video.');
        } finally {
            setDeleting(false);
        }
    };

    const handleReport = async () => {
        if (!video || !userDetail) {
            showToast('Please log in to report this video.');
            return;
        }

        try {
            setReporting(true);
            showToast('Reporting video...');

            // Firestore "reports" collection
            const reportRef = doc(
                db,
                'reports',
                `${video.id}_${userDetail?.email}`,
            );

            await setDoc(reportRef, {
                videoId: video.id,
                title: video.title,
                reportedBy: userDetail?.email,
                reason: reportReason,
                reportedAt: serverTimestamp(),
            });

            setReportReason('');
            showToast('Video reported successfully!');
            setShowReportModal(false);
        } catch (error) {
            console.error('Report failed:', error);
            showToast('Failed to report video.');
        } finally {
            setReporting(false);
        }
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
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Colors.BG_COLOR,
                }}
            >
                <TouchableOpacity
                    onPress={safeBack}
                    style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}
                >
                    <AntDesign name="left" color={'white'} size={20} />
                    <Text style={{ color: Colors.WHITE, fontSize: 18 }}>
                        Back
                    </Text>
                </TouchableOpacity>
                <View style={styles.loader}>
                    <Text style={[styles.title, { color: 'white' }]}>
                        Oops! Video not found
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                }}
            >
                <TouchableOpacity style={styles.backButton} onPress={safeBack}>
                    <AntDesign name="left" size={24} color={Colors.BLACK} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.backButton}>
                    {video.uploadedBy !== 'YouTube' && (
                        <>
                            <TouchableOpacity
                                disabled={adding}
                                onPress={handleFavorite}
                            >
                                {adding ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <AntDesign
                                        name={favorite ? 'heart' : 'hearto'}
                                        size={24}
                                        color={
                                            favorite ? Colors.RED : Colors.BLACK
                                        }
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDownload}
                                disabled={downloading}
                            >
                                {downloading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <Feather
                                        name="download-cloud"
                                        size={24}
                                        color={Colors.BLACK}
                                    />
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity
                        onPress={() => setShowOptions((prev) => !prev)}
                    >
                        <MaterialIcons
                            name="more-vert"
                            size={24}
                            color={Colors.BLACK}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {(() => {
                const isYouTube = video.uploadedBy === 'YouTube';
                let videoId: string | null = null;

                if (isYouTube) {
                    videoId = video.id; // ✅ Use the ID directly

                    return (
                        <YoutubePlayer
                            height={230}
                            play={true}
                            videoId={videoId}
                        />
                    );
                }

                if (enrolled) {
                    return (
                        <VideoView
                            source={{ uri: video.videoURL }}
                            style={styles.video}
                            controls
                            resizeMode="contain"
                        />
                    );
                }

                return (
                    <Image
                        source={{ uri: video.thumbnailURL }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                );
            })()}

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{video.title}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <Text style={styles.uploadedBy}>
                        by{' '}
                        <Text style={{ fontFamily: 'outfit-bold' }}>
                            {uploaderName || video.uploadedBy}
                        </Text>
                    </Text>
                    {video.uploadedBy === 'YouTube' ? (
                        <AntDesign name="youtube" size={14} color={'red'} />
                    ) : (
                        <Ionicons
                            name="checkmark-circle"
                            color={Colors.PRIMARY}
                            size={14}
                        />
                    )}
                </View>

                <View style={styles.durationContainer}>
                    <View style={[styles.durationInfo, { left: 5 }]}>
                        {video?.uploadedBy !== 'YouTube' && (
                            <>
                                <FontAwesome
                                    name="calendar"
                                    size={14}
                                    color={Colors.BLACK}
                                />
                                <Text style={styles.uploadedAt}>
                                    {uploadedAtText}
                                </Text>
                            </>
                        )}
                    </View>
                    <View style={[styles.durationInfo, { left: 40 }]}>
                        <AntDesign
                            name="clockcircleo"
                            size={14}
                            color={Colors.BLACK}
                        />
                        <Text style={styles.duration}>
                            {typeof video.duration === 'string'
                                ? formatYouTubeDuration(video.duration)
                                : formatDuration(video.duration)}{' '}
                        </Text>
                    </View>
                    <View style={[styles.durationInfo, { maxWidth: 100 }]}>
                        <FontAwesome5
                            name="users"
                            size={14}
                            color={Colors.BLACK}
                        />
                        <Text numberOfLines={1} style={styles.duration}>
                            {formatViews(video.views)}
                        </Text>
                    </View>
                </View>
                <View style={styles.common}>
                    <View style={styles.box}>
                        <Text style={styles.level}>Level</Text>
                        <Text style={styles.commonText}>
                            {video?.level
                                ? video.level.charAt(0).toUpperCase() +
                                  video.level.slice(1)
                                : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.level}>Language</Text>
                        <Text style={styles.commonText}>English</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.section}>
                    {[
                        'Overview',
                        // "Resources",
                        'Reviews',
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tabButton,
                                activeTab === tab && styles.tabButtonActive,
                            ]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <Text
                                style={[
                                    styles.options,
                                    activeTab === tab && {
                                        color: Colors.GREEN,
                                    },
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ marginHorizontal: 12, marginTop: 10 }}>
                    {renderTabContent()}
                </View>
            </ScrollView>
            {!enrolled && video.uploadedBy !== 'YouTube' && (
                <View style={styles.enrollContainer}>
                    <Button
                        text={enrolled ? 'Enrolled' : 'Enroll Now'}
                        onPress={handleEnroll}
                        type="fill"
                        loading={enrolling}
                        disabled={enrolling || enrolled}
                        icon={
                            <AntDesign
                                name="playcircleo"
                                size={20}
                                color={Colors.WHITE}
                            />
                        }
                    />
                </View>
            )}

            {showOptions && (
                <View
                    style={{
                        position: 'absolute',
                        top: 60,
                        right: 10,
                        backgroundColor: Colors.WHITE,
                        borderRadius: 8,
                        padding: 10,
                        elevation: 5, // Android shadow
                        shadowColor: '#000', // iOS shadow
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                    }}
                >
                    {userDetail?.roles.includes('admin') && (
                        <TouchableOpacity
                            onPress={() => {
                                setShowOptions(false);
                                setShowDeleteModal({
                                    visible: true,
                                    title: 'Delete Video',
                                    message:
                                        'Are you sure you want to delete this video?',
                                });
                            }}
                            style={{
                                borderBottomWidth: 0.5,
                                borderColor: Colors.GRAY,
                                width: '100%',
                            }}
                        >
                            <Text
                                style={{
                                    padding: 8,
                                    color: 'red',
                                }}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => {
                            setShowOptions(false);
                            setShowReportModal(true);
                        }}
                    >
                        <Text style={{ padding: 8 }}>Report</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={showReportModal} transparent animationType="slide">
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <View
                        style={{
                            width: '80%',
                            backgroundColor: Colors.WHITE,
                            borderRadius: 8,
                            padding: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginBottom: 10,
                            }}
                        >
                            Report Video
                        </Text>
                        <Text style={{ marginBottom: 20 }}>
                            Please provide a reason for reporting this video.
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: Colors.GRAY,
                                borderRadius: 4,
                                padding: 10,
                                marginBottom: 20,
                            }}
                            placeholder="Reason"
                            value={reportReason}
                            onChangeText={setReportReason}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <TouchableOpacity
                                disabled={reporting}
                                onPress={() => setShowReportModal(false)}
                            >
                                <Text
                                    style={{
                                        color: Colors.GRAY,
                                        opacity: reporting ? 0.5 : 1,
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.LIGHT_RED,
                                    padding: 8,
                                    borderRadius: 8,
                                }}
                                disabled={reporting}
                                onPress={handleReport}
                            >
                                {reporting ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <Text
                                        style={{
                                            color: Colors.RED,
                                            opacity: reporting ? 0.5 : 1,
                                        }}
                                    >
                                        Report
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <AppModal
                visible={showDeleteModal.visible}
                title={showDeleteModal.title}
                message={showDeleteModal.message}
                onCancel={() =>
                    setShowDeleteModal({ ...showDeleteModal, visible: false })
                }
                onConfirm={() => {
                    setShowDeleteModal({ ...showDeleteModal, visible: false });
                    handleDeleteVideo();
                }}
            />
        </SafeAreaView>
    );
}
