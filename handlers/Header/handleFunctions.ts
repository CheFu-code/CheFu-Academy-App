import { db } from '@/config/firebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { showToast } from '@/utils/toast';
import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { useContext, useState } from 'react';
import { Linking } from 'react-native';

export const useHandles = () => {
    const { safePush, safeReplace } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            showToast('Please enter a search term');
            return;
        }

        safePush({
            pathname: '/searchResults',
            params: { query: searchTerm.trim() },
        });
        setSearchTerm('');
    };

    const handleOption = async (option: string) => {
        setShowModal(false);

        if (option === 'Rate our app') {
            // Handle rate our app action
            const url =
                'https://play.google.com/store/apps/details?id=com.chefu.chefuacademy';
            Linking.openURL(url).catch((err) => {
                console.error('Failed to open URL:', err);
                showToast('Failed to open Google Play store');
            });
        } else if (option === 'View Profile') {
            safePush('/(tabs)/profile');
        } else if (option === 'Contact Support') {
            Linking.openURL(
                'mailto:chefu.inc@gmail.com?subject=Support Request&body=Please describe your issue here.',
            );
        } else if (option === 'Add Course') {
            safePush('/addCourse');
        } else if (option === 'Favorite Videos') {
            safePush('/favoriteVideos');
        } else if (option === 'Post Spark') {
            safePush('/addSpark');
        }
    };

    const handleSaveVideo = async (videoData: any) => {
        if (!videoData || !videoData.videoId) return;

        try {
            const videoRef = doc(db, 'youTubeVideos', videoData.videoId);

            await setDoc(videoRef, {
                title: videoData.title,
                thumbnailURL: videoData.thumbnailURL,
                videoId: videoData.videoId,
                createdAt: serverTimestamp(),
                category: videoData.category,
            });

            showToast('Video saved successfully!');
        } catch (error) {
            console.error('Error saving video:', error);
            showToast('Failed to save video');
        }
    };

    return { handleSearch, handleOption, handleSaveVideo };
};
