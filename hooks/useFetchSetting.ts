import { BIOMETRICS } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import { showToast } from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useContext, useRef, useState } from 'react';

export const useFetchSetting = () => {
    const { userDetail } = useContext(UserDetailContext);
    const fetchingRef = useRef(false);
    const [notifications, setNotifications] = useState(true);
    const [useBiometrics, setUseBiometrics] = useState(true);

    const fetchSettings = useCallback(async () => {
        if (fetchingRef.current || !userDetail?.email) return;
        fetchingRef.current = true;

        try {
            const response = await chefuApiClient.get(
                '/api/academy/mobile/settings',
            );
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
        } catch (error) {
            console.error('Failed to fetch settings', error);
            showToast('Failed to fetch settings');
        } finally {
            fetchingRef.current = false;
        }
    }, [userDetail?.email]);

    return {
        notifications,
        setNotifications,
        fetchSettings,
        useBiometrics,
        setUseBiometrics,
    };
};
