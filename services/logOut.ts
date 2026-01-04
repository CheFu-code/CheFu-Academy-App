import { auth } from '@/config/fireConfig';
import { CACHE_KEY } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';

export const useLogOut = () => {
    const { setUserDetail } = useContext(UserDetailContext);
    const [fatalError, setFatalError] = useState(null);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const logOut = async () => {
        try {
            await auth.signOut();
            await AsyncStorage.removeItem('userDetail');
            await AsyncStorage.removeItem(CACHE_KEY);
            await AsyncStorage.removeItem('useBiometrics');
            setUserDetail(null);
        } catch (err: any) {
            setFatalError(err);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: 'Failed to log out. Please try again.',
            });
        }
    };
    return { logOut };
};
