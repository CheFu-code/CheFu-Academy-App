import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import * as Linking from 'expo-linking';
import { useCallback, useEffect } from 'react';

const useHandleDynamicLinks = () => {
    const { safePush } = useSafeNavigation();

    const handleUrl = useCallback((url: string | null) => {
        if (!url) return;

        const sparkId = url.split('/spark/')[1]?.split(/[?#]/)[0];
        if (sparkId) {
            safePush({
                pathname: '/sparkDetail',
                params: { sparkId },
            });
        }
    }, [safePush]);

    useEffect(() => {
        const subscription = Linking.addEventListener('url', ({ url }) => {
            handleUrl(url);
        });

        Linking.getInitialURL()
            .then(handleUrl)
            .catch(() => {
                // Deep links are best effort and should never block app startup.
            });

        return () => subscription.remove();
    }, [handleUrl]);
};

export default useHandleDynamicLinks;
