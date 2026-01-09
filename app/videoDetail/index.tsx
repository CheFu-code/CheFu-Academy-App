import NotFound from '@/component/VideoDetail/NotFound';
import OverView from '@/component/VideoDetail/OverView';
import Reviews from '@/component/VideoDetail/Reviews';
import VideoDetailUI from '@/component/VideoDetail/VideoDetailUI';
import { db } from '@/config/firebaseConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useFetchVideoUploader } from '@/hooks/fetchVidUploader';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { fetchVideoById } from '@/services/videoService';
import { styles } from '@/styles/VideoDetail.styles';
import { doc, getDoc } from '@react-native-firebase/firestore';

import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function VideoDetail() {
    const { safeBack } = useSafeNavigation();
    const { id, ytVideo } = useLocalSearchParams();
    const { userDetail } = useContext(UserDetailContext);
    const { color, backgroundColor } = useDarkMode();
    const {
        video,
        setVideo,
        adding,
        favorite,
        setFavorite,
        reporting,
        enrolling,
        downloading,
        uploaderName,
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
    } = useFetchVideoUploader();
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
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
    }, [id, ytVideo, setVideo]);

    useEffect(() => {
        fetchUploaderName();
    }, [video, fetchUploaderName]);

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
    }, [video, userDetail, setFavorite]);

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
        return <NotFound />;
    }

    return (
        <VideoDetailUI
            backgroundColor={backgroundColor}
            safeBack={safeBack}
            color={color}
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
