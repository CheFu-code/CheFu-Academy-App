import { BIOMETRICS } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { showToast } from './toast';

export const useFetchSetting = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [fetching, setFetching] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [useBiometrics, setUseBiometrics] = useState(true);
    const [fatalError, setFatalError] = useState(null);

    async function fetchSettings() {
        if (fetching) return;
        setFetching(true);
        try {
            if (!userDetail?.email) return;

            const response = await chefuApiClient.get('/api/academy/mobile/settings');
            const data = response.data;

            if (typeof data.notifications === 'boolean') {
                setNotifications(data.notifications);
            }

            if (typeof data.useBiometrics === 'boolean') {
                setUseBiometrics(data.useBiometrics);
                await AsyncStorage.setItem(
                    BIOMETRICS,
                    data.useBiometrics.toString(),
                );
            }
        } catch (error: any) {
            setFatalError(error);
            console.error('Failed to fetch settings', error);
            if (typeof ToastAndroid !== 'undefined') {
                showToast('Failed to fetch settings');
            }
        } finally {
            setFetching(false);
        }
    }

    return {
        notifications,
        setNotifications,
        fetchSettings,
        useBiometrics,
        setUseBiometrics,
    };
};
