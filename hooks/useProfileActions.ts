import { useAuth } from '@/context/AuthContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { showToast } from '@/utils/toast';
import * as Sentry from '@sentry/react-native';
import { useCallback, useState } from 'react';

export function useProfileActions() {
    const { logout } = useAuth();
    const { safeReplace } = useSafeNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            await logout();
            safeReplace('/auth/sso' as any);
        } catch (err) {
            showToast('Failed to logout');
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    }, [logout, safeReplace]);

    return { loading, handleLogout };
}
