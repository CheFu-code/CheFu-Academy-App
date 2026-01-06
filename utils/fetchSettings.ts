import { auth, db } from '@/config/fireConfig';
import { BIOMETRICS } from '@/constant/caches';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from '@react-native-firebase/firestore';
import { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { showToast } from './toast';

export const useFetchSetting = () => {
    const [fetching, setFetching] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [useBiometrics, setUseBiometrics] = useState(true);
    const [fatalError, setFatalError] = useState(null);

    async function fetchSettings() {
        if (fetching) return;
        setFetching(true);
        try {
            const user = auth.currentUser;
            if (!user?.email) return;

            const docRef = doc(db, 'users', user?.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (!data) return;

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

    return { fetchSettings };
};
