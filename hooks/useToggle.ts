import { BIOMETRICS } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import { showToast } from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useContext } from 'react';

export const useToggle = () => {
    const { userDetail } = useContext(UserDetailContext);

    const toggleSetting = useCallback(
        async (
            name: string,
            stateSetter: (value: boolean) => void,
            current: boolean,
        ) => {
            const newValue = !current;

            try {
                if (name === 'Biometric Lock') {
                    const [compatible, enrolled] = await Promise.all([
                        LocalAuthentication.hasHardwareAsync(),
                        LocalAuthentication.isEnrolledAsync(),
                    ]);

                    if (!compatible || !enrolled) {
                        showToast(
                            'Biometric authentication is not available on this device.',
                        );
                        return;
                    }
                }

                stateSetter(newValue);

                if (!userDetail?.email) return;

                await chefuApiClient.patch('/api/academy/mobile/settings', {
                    [name === 'Biometric Lock'
                        ? 'useBiometrics'
                        : 'notifications']: newValue,
                });

                if (name === 'Biometric Lock') {
                    await AsyncStorage.setItem(
                        BIOMETRICS,
                        newValue.toString(),
                    );
                }
            } catch (error) {
                stateSetter(current);
                console.error('Failed to update setting:', error);
                showToast('Failed to save settings');
            }
        },
        [userDetail?.email],
    );

    return { toggleSetting };
};
