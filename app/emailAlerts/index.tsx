import EmailAlertsUI from '@/component/Setting/EmailAlertsUI';
import { auth, db } from '@/config/fireConfig';
import { PREF_KEY } from '@/constant/caches';
import { DEFAULT_PREFS, PrefKey } from '@/constant/Preferences';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function EmailAlerts() {
    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState(DEFAULT_PREFS);

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const local = await AsyncStorage.getItem(PREF_KEY);
                if (local) {
                    setPreferences(JSON.parse(local));
                }

                const user = auth.currentUser;
                if (user?.email) {
                    const ref = doc(db, 'users', user.email);
                    const snap = await getDoc(ref);

                    if (!snap.exists()) return;

                    const data = snap.data(); // ✔️ now TypeScript understands it's stable
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
    }, []);

    const toggle = async (type: PrefKey) => {
        const updated = { ...preferences, [type]: !preferences[type] };
        setPreferences(updated);

        try {
            await AsyncStorage.setItem(PREF_KEY, JSON.stringify(updated));
            const user = auth.currentUser;
            if (user && user.email) {
                const ref = doc(db, 'users', user.email);
                await setDoc(
                    ref,
                    { emailPreferences: updated },
                    { merge: true },
                );
                console.log('Firestore updated successful...');
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
            const user = auth.currentUser;
            if (user && user.email) {
                const ref = doc(db, 'users', user.email);
                await setDoc(
                    ref,
                    { emailPreferences: DEFAULT_PREFS },
                    { merge: true },
                );
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
