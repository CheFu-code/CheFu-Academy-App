import { SHARE_MESSAGE, SHARE_URL } from '@/constant/random';
import { useState } from 'react';
import { Platform, Share } from 'react-native';

export const useShareApp = () => {
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });
    const handleShare = async () => {
        try {
            await Share.share({
                title: SHARE_MESSAGE,
                message:
                    Platform.OS === 'ios'
                        ? `${SHARE_MESSAGE} ${SHARE_URL}`
                        : SHARE_MESSAGE,
                url: Platform.OS === 'ios' ? SHARE_URL : undefined,
            });
        } catch (error: any) {
            setErrorModal({
                visible: true,
                title: 'Sharing Failed',
                message: 'Failed to share content. Please try again.',
            });
        }
    };

    return { handleShare };
};
