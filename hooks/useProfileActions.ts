import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/utils/toast';
import * as Sentry from '@sentry/react-native';
import { useCallback, useState } from 'react';

export function useProfileActions() {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            await logout();
        } catch (err) {
            showToast('Failed to logout');
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    }, [logout]);

    return { loading, handleLogout };
}
