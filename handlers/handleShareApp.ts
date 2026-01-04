import { SHARE_MESSAGE, SHARE_URL } from '@/constant/random';
import { useState } from 'react';
import { Platform, Share } from 'react-native';

export const useShareApp = () => {
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });
    const [fatalError, setFatalError] = useState(null);
    const handleShare = async () => {
        try {
            const result = await Share.share({
                title: SHARE_MESSAGE,
                message:
                    Platform.OS === 'ios'
                        ? `${SHARE_MESSAGE} ${SHARE_URL}`
                        : SHARE_MESSAGE,
                url: Platform.OS === 'ios' ? SHARE_URL : undefined,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log(
                        'Shared with activity type:',
                        result.activityType,
                    );
                } else {
                    // shared
                    console.log('Shared successfully!');
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log('Share dismissed');
            }
        } catch (error: any) {
            setFatalError(error);
            setErrorModal({
                visible: true,
                title: 'Sharing Failed',
                message: 'Failed to share content. Please try again.',
            });
        }
    };

    return { handleShare };
};
