import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useContext, useState } from 'react';

export const useExportUserData = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [fatalError, setFatalError] = useState(null);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const exportUserData = async () => {
        try {
            setLoading(true);
            if (!userDetail?.email) {
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'User not logged in',
                });
                setLoading(false);
                return;
            }

            const response = await chefuApiClient.get('/api/academy/mobile/me/export');
            const userData = response.data;

            if (!userData) {
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'No user data found to export.',
                });
                setLoading(false);
                return;
            }

            const json = JSON.stringify(userData, null, 2);
            const safeEmail = userDetail.email.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `${FileSystem.documentDirectory}my_chefu_academy_data_${safeEmail}.json`;

            await FileSystem.writeAsStringAsync(filename, json, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            await Sharing.shareAsync(filename, {
                mimeType: 'application/json',
                dialogTitle: 'Export User Data',
                UTI: 'public.json',
            });
        } catch (error: any) {
            setFatalError(error);
            console.error('Export failed', error);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: 'Failed to export user data.',
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        setLoading,
        fatalError,
        setFatalError,
        errorModal,
        setErrorModal,
        exportUserData,
    };
};
