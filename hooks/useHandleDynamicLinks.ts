import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useCallback, useEffect } from 'react';

const useHandleDynamicLinks = () => {
    const { safePush } = useSafeNavigation()

    const handleLink = useCallback((link: any) => {
        const sparkId = link.url.split('/spark/')[1];
        if (sparkId) {
            safePush({
                pathname: '/sparkDetail',
                params: { sparkId },
            });
        }
    }, [safePush]);

    useEffect(() => {
        // App opened from background / foreground
        const unsubscribe = dynamicLinks().onLink(handleLink);

        // App opened from quit state
        dynamicLinks()
            .getInitialLink()
            .then((link) => {
                if (link) handleLink(link);
            });

        return () => unsubscribe();
    }, [handleLink]);


};

export default useHandleDynamicLinks;