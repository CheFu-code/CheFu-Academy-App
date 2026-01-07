import { SEEN_WELCOME } from '@/constant/caches';
import { UserDetail } from '@/types/UserDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeNavigation } from './useSafeNavigation';

const useProtectedRoute = (
    userDetail: UserDetail | null | undefined,
    authChecked: boolean,
) => {
    const segments = useSegments();
    const { safeReplace } = useSafeNavigation();
    const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(SEEN_WELCOME).then((value) => {
            setHasSeenWelcome(value === 'true');
        });
    }, []);

    useEffect(() => {
        if (!authChecked) return;
        if (userDetail === undefined) return;
        if (hasSeenWelcome === null) return;

        const first = segments?.[0];
        const inAuthGroup = first === 'auth';

        if (userDetail && inAuthGroup) {
            safeReplace('/(tabs)/home');
            return;
        }

        if (!userDetail && !hasSeenWelcome && !inAuthGroup) {
            console.log('Redirecting to CheFu Academy welcome screen');
            safeReplace('/');
            return;
        }

        if (!userDetail && hasSeenWelcome && !inAuthGroup) {
            safeReplace('/auth/signIn');
        }
    }, [authChecked, userDetail, segments, safeReplace, hasSeenWelcome]);
};

export default useProtectedRoute;
