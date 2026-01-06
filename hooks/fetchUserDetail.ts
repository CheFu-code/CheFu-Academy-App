import { db } from '@/config/firebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';
import { TrustedDevice } from '@/types/trustedDevice';
import { showToast } from '@/utils/toast';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';
import { useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';

export const useFetchUser = () => {
    const [loading, setLoading] = useState(false);
    const [loadingDevice, setLoadingDevice] = useState<string | null>(null);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const fetchUserDetail = useCallback(async () => {
        if (!userDetail?.email) return;

        try {
            setLoading(true);
            const snapshot = await getDoc(doc(db, 'users', userDetail?.email)); // 👈 wrap with doc()
            if (snapshot.exists()) {
                const data = snapshot.data();
                setUserDetail({ ...userDetail, ...data });
            }
        } catch (err) {
            console.error('Failed to fetch user detail:', err);
            showToast('Failed to refresh data');
        } finally {
            setLoading(false);
        }
    }, [setUserDetail, userDetail]);

    const deleteFromTrustedDevices = (device: TrustedDevice) => {
        Alert.alert(
            'Confirm Removal',
            'Are you sure you want to remove this device from your trusted devices?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (
                                !userDetail?.email ||
                                !userDetail?.trustedDevices
                            ) {
                                showToast('Your data not found');
                                return;
                            }
                            setLoadingDevice(device.modelName || 'unknown');
                            const filteredDevices =
                                userDetail.trustedDevices.filter(
                                    (d: TrustedDevice) =>
                                        !(
                                            d.brand === device.brand &&
                                            d.modelName === device.modelName &&
                                            d.osName === device.osName &&
                                            d.osVersion === device.osVersion &&
                                            d.deviceType === device.deviceType
                                        ),
                                );
                            await updateDoc(
                                doc(db, 'users', userDetail?.email),
                                {
                                    trustedDevices: filteredDevices,
                                },
                            );
                            setUserDetail({
                                ...userDetail,
                                trustedDevices: filteredDevices,
                            });
                            Alert.alert(
                                'Success',
                                'Device removed from trusted list',
                            );
                        } catch (error) {
                            console.error(
                                'Error removing trusted device:',
                                error,
                            );
                            Alert.alert('Error', 'Failed to remove device');
                        } finally {
                            setLoadingDevice(null);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const getUserDetail = async (email: string) => {
        try {
            const userDocRef = doc(db, 'users', email);
            // Update lastLogin to now
            await userDocRef.update({ lastLogin: new Date() });
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserDetail(userDoc.data());
            } else {
                console.warn('User data not found in Firestore.');
            }
        } catch (error) {
            console.error('Error fetching user data from sign in:', error);
            Sentry.captureException(error);
        }
    };

    return { fetchUserDetail, deleteFromTrustedDevices, getUserDetail };
};
