import AppModal from "@/component/Shared/AppModal";
import Button from "@/component/Shared/Button";
import OverView from "@/component/VideoDetail/OverView";
import Resources from "@/component/VideoDetail/Resources";
import Reviews from "@/component/VideoDetail/Reviews";
import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { formatDuration } from "@/helpers/formatDateVideoCard";
import { fetchVideoById } from "@/services/videoService";
import { styles } from "@/styles/VideoDetail.styles";
import { Video } from "@/types/video";
import { showToast } from "@/utils/toast";
import {
    AntDesign,
    Feather,
    FontAwesome5,
    MaterialIcons,
} from "@expo/vector-icons";
import {
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    increment,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "@react-native-firebase/firestore";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video as VideoView } from "react-native-video";

export default function VideoDetail() {
    const db = getFirestore();
    const router = useRouter();
    const { id } = useLocalSearchParams();
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
    const [reportReason, setReportReason] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const uploadedAtText = video?.uploadedAt?.toDate().toLocaleDateString();

    const [activeTab, setActiveTab] = useState<
        "Overview" | "Resources" | "Reviews"
    >("Overview");

    const [showDeleteModal, setShowDeleteModal] = useState({
        visible: false,
        title: "",
        message: "",
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case "Overview":
                return <OverView video={video} />;
            case "Resources":
                return <Resources video={video} />;
            case "Reviews":
                return <Reviews video={video} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const loadVideo = async () => {
            const data = await fetchVideoById(id as string);
            setVideo(data);
            setLoading(false);
        };
        loadVideo();
    }, [id]);

    const handleEnroll = async () => {
        setEnrolling(true);
        if (!userDetail) {
            showToast("Please log in to enroll.");
            setEnrolling(false);
            return;
        }
        if (!video) {
            setEnrolling(false);
            return;
        }
        if (!video) return;

        try {
            // user enrollments collection
            const ref = doc(
                db,
                "users",
                userDetail.email,
                "enrollments",
                video.id
            );

            await setDoc(ref, {
                videoId: video.id,
                title: video.title,
                thumbnailURL: video.thumbnailURL,
                enrolledAt: serverTimestamp(),
            });

            // increment video views count
            const videoRef = doc(db, "videos", video.id);
            await updateDoc(videoRef, {
                views: increment(1),
            });

            // also update local state so UI reflects immediately
            setVideo((prev) =>
                prev ? { ...prev, views: (prev.views || 0) + 1 } : prev
            );

            showToast("You have successfully enrolled!");
        } catch (err) {
            console.error("Enrollment failed:", err);
            showToast("Something went wrong while enrolling.");
        } finally {
            setEnrolling(false);
        }
    };

    useEffect(() => {
        if (!userDetail || !video) return;
        const ref = doc(db, "users", userDetail.email, "enrollments", video.id);
        getDoc(ref).then((docSnap) => {
            if (docSnap.exists()) setEnrolled(true);
        });
    }, [video]);

    useEffect(() => {
        if (!userDetail || !video) return;
        const favRef = doc(
            db,
            "users",
            userDetail.email,
            "favorites",
            video.id
        );
        getDoc(favRef).then((docSnap) => {
            if (docSnap.exists()) setFavorite(true);
        });
    }, [video, userDetail]);

    const handleFavorite = async () => {
        setAdding(true);
        if (!userDetail) {
            showToast("Please log in to add favorites.");
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
                "users",
                userDetail.email,
                "favorites",
                video.id
            );

            if (favorite) {
                // already favorite → remove
                await deleteDoc(favRef);
                setFavorite(false);
                showToast("Removed from favorites.");
            } else {
                // add to favorites
                await setDoc(favRef, {
                    videoId: video.id,
                    title: video.title,
                    thumbnailURL: video.thumbnailURL,
                    addedAt: serverTimestamp(),
                });
                setFavorite(true);
                showToast("Added to favorites!");
            }
        } catch (err) {
            console.error("Favorite toggle failed:", err);
            showToast("Something went wrong while updating favorites.");
        } finally {
            setAdding(false);
        }
    };

    const handleDownload = async () => {
        if (!video) return;
        if (userDetail.member === false) {
            showToast("Only members can download videos.");
            showToast("Please upgrade your membership.");
            return;
        }

        try {
            setDownloading(true);
            showToast("Downloading...");

            // Request permission to save to gallery (for iOS/Android)
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                showToast("Permission denied to save file.");
                setDownloading(false);
                return;
            }

            // Define local file path
            const fileUri = FileSystem.documentDirectory + `${video.title}.mp4`;

            // Download video
            const { uri } = await FileSystem.downloadAsync(
                video.videoURL,
                fileUri
            );

            // Save to gallery / camera roll
            await MediaLibrary.createAssetAsync(uri);

            showToast("Video downloaded successfully!");
        } catch (error) {
            console.error("Download failed:", error);
            showToast("Failed to download video.");
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteVideo = async () => {
        if (!video) return;

        try {
            setDeleting(true);
            showToast("Deleting video...");

            // Delete video from database
            const videoRef = doc(db, "videos", video.id);
            await deleteDoc(videoRef);

            router.replace("/(tabs)/home");
            showToast("Video deleted successfully!");
        } catch (error) {
            console.error("Delete failed:", error);
            showToast("Failed to delete video.");
        } finally {
            setDeleting(false);
        }
    };

    const handleReport = async () => {
        if (!video || !userDetail) {
            showToast("Please log in to report this video.");
            return;
        }

        try {
            setReporting(true);
            showToast("Reporting video...");

            // Firestore "reports" collection
            const reportRef = doc(
                db,
                "reports",
                `${video.id}_${userDetail.email}`
            );

            await setDoc(reportRef, {
                videoId: video.id,
                title: video.title,
                reportedBy: userDetail.email,
                reason: reportReason,
                reportedAt: serverTimestamp(),
            });

            showToast("Video reported successfully!");
        } catch (error) {
            console.error("Report failed:", error);
            showToast("Failed to report video.");
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
            <View style={styles.loader}>
                <Text style={styles.title}>Oops! Video not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                }}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <AntDesign name="left" size={24} color={Colors.BLACK} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.backButton}>
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
                                name={favorite ? "heart" : "hearto"}
                                size={24}
                                color={favorite ? Colors.RED : Colors.BLACK}
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

            {enrolled ? (
                <VideoView
                    source={{ uri: video.videoURL }}
                    style={styles.video}
                    controls
                    resizeMode="contain"
                />
            ) : (
                <Image
                    source={{ uri: video.thumbnailURL }}
                    style={styles.image}
                    resizeMode="contain"
                />
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{video.title}</Text>
                <Text style={styles.uploadedBy}>by {video.uploadedBy}</Text>

                <View style={styles.durationContainer}>
                    <Text style={styles.uploadedAt}>{uploadedAtText}</Text>
                    <View style={[styles.durationInfo, { left: 40 }]}>
                        <AntDesign
                            name="clockcircleo"
                            size={14}
                            color={Colors.BLACK}
                        />
                        <Text style={styles.duration}>
                            {formatDuration(video.duration)}
                        </Text>
                    </View>
                    <View style={[styles.durationInfo, { maxWidth: 100 }]}>
                        <FontAwesome5
                            name="users"
                            size={14}
                            color={Colors.BLACK}
                        />
                        <Text numberOfLines={1} style={styles.duration}>
                            {video.views}
                        </Text>
                    </View>
                </View>
                <View style={styles.common}>
                    <View style={styles.box}>
                        <Text style={styles.level}>Level</Text>
                        <Text style={styles.commonText}>
                            Beginner to Advanced
                        </Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.level}>Language</Text>
                        <Text style={styles.commonText}>English</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.section}>
                    {["Overview", "Resources", "Reviews"].map((tab) => (
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
            <View style={styles.enrollContainer}>
                <Button
                    opacity={enrolling ? 0.5 : 1}
                    text={enrolled ? "Enrolled" : "Enroll Now"}
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

            {showOptions && (
                <View
                    style={{
                        position: "absolute",
                        top: 60,
                        right: 10,
                        backgroundColor: Colors.WHITE,
                        borderRadius: 8,
                        padding: 10,
                        elevation: 5, // Android shadow
                        shadowColor: "#000", // iOS shadow
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                    }}
                >
                    {/* <TouchableOpacity
                        onPress={() => {
                            setShowOptions(false);
                            handleFavorite();
                        }}
                    >
                        <Text style={{ padding: 8 }}>
                            {favorite
                                ? "Remove from Favorites"
                                : "Add to Favorites"}
                        </Text>
                    </TouchableOpacity> */}

                    {userDetail?.roles.includes("admin") && (
                        <TouchableOpacity
                            onPress={() => {
                                setShowOptions(false);
                                setShowDeleteModal({
                                    visible: true,
                                    title: "Delete Video",
                                    message:
                                        "Are you sure you want to delete this video?",
                                });
                            }}
                            style={{
                                borderBottomWidth: 0.5,
                                borderColor: Colors.GRAY,
                                width: "100%",
                            }}
                        >
                            <Text
                                style={{
                                    padding: 8,
                                    color: "red",
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
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            backgroundColor: Colors.WHITE,
                            borderRadius: 8,
                            padding: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
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
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setShowReportModal(false)}
                            >
                                <Text style={{ color: Colors.GRAY }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleReport}>
                                <Text style={{ color: Colors.RED }}>
                                    Report
                                </Text>
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
