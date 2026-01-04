import { auth, db } from '@/config/fireConfig';
import { doc, getDoc } from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';

export const useExportUserData = () => {
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
            const user = auth.currentUser;
            if (!user?.email) {
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'User not logged in',
                });
                setLoading(false);
                return;
            }

            const docRef = doc(db, 'users', user.email);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setErrorModal({
                    visible: true,
                    title: 'Error',
                    message: 'No user data found to export.',
                });
                setLoading(false);
                return;
            }

            const userData = docSnap.data();
            const json = JSON.stringify(userData, null, 2);
            const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, '_');
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

    return { exportUserData };
};
