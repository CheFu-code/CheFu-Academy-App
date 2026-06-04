import EmailAlertsUI from '@/component/Setting/EmailAlertsUI';
import { PREF_KEY } from '@/constant/caches';
import { DEFAULT_PREFS, PrefKey } from '@/constant/Preferences';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function EmailAlerts() {
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState(DEFAULT_PREFS);

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const local = await AsyncStorage.getItem(PREF_KEY);
                if (local) {
                    setPreferences(JSON.parse(local));
                }

                if (userDetail?.email) {
                    const response = await chefuApiClient.get('/api/academy/mobile/settings');

                    const data = response.data;
                    if (data?.emailPreferences) {
                        setPreferences(data.emailPreferences);

                        await AsyncStorage.setItem(
                            PREF_KEY,
                            JSON.stringify(data.emailPreferences),
                        );
                    }
                }
            } catch (err) {
                console.error('Load failed', err);
            }
        };

        loadPreferences();
    }, [userDetail?.email]);

    const toggle = async (type: PrefKey) => {
        const updated = { ...preferences, [type]: !preferences[type] };
        setPreferences(updated);

        try {
            await AsyncStorage.setItem(PREF_KEY, JSON.stringify(updated));
            if (userDetail?.email) {
                await chefuApiClient.patch('/api/academy/mobile/settings', {
                    emailPreferences: updated,
                });
                console.log('Email preferences updated successfully');
            }
        } catch (err) {
            console.error('Save failed', err);
            Alert.alert('Error', 'Failed to save preferences.');
        }
    };

    const resetToDefault = async () => {
        setPreferences(DEFAULT_PREFS);
        try {
            setLoading(true);
            await AsyncStorage.setItem(PREF_KEY, JSON.stringify(DEFAULT_PREFS));
            if (userDetail?.email) {
                await chefuApiClient.patch('/api/academy/mobile/settings', {
                    emailPreferences: DEFAULT_PREFS,
                });
                Alert.alert(
                    'Success',
                    'Preferences have been reset to default.',
                );
            }
        } catch (err) {
            console.error('Reset failed', err);
            Alert.alert('Error', 'Failed to reset preferences.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <EmailAlertsUI
            preferences={preferences}
            toggle={toggle}
            resetToDefault={resetToDefault}
            loading={loading}
        />
    );
}
