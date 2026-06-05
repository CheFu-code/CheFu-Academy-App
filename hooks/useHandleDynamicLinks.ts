import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import * as Linking from 'expo-linking';
import { useCallback, useEffect } from 'react';

const extractTrustedSparkId = (url: string) => {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();
        const isAppScheme = parsed.protocol === 'chefu-academy:';
        const isCheFuHost =
            parsed.protocol === 'https:' &&
            (host === 'chefuinc.com' || host.endsWith('.chefuinc.com'));

        if (!isAppScheme && !isCheFuHost) return null;

        return url.match(/\/spark\/([^/?#]+)/)?.[1] || null;
    } catch {
        return null;
    }
};

const useHandleDynamicLinks = () => {
    const { safePush } = useSafeNavigation();

    const handleUrl = useCallback((url: string | null) => {
        if (!url) return;

        const sparkId = extractTrustedSparkId(url);
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
