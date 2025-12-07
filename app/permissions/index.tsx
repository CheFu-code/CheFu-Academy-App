import PermissionsUI from '@/component/Setting/PermissionsUI';
import { auth, db } from '@/config/fireConfig';
import { doc, setDoc } from '@react-native-firebase/firestore';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

type PermissionKeys = 'camera' | 'mediaLibrary' | 'location' | 'notifications';

export default function Permissions() {
    const [cameraPermission, requestCameraPermission] =
        Camera.useCameraPermissions();

    const [permissions, setPermissions] = useState({
        camera: false,
        mediaLibrary: false,
        location: false,
        notifications: false,
    });

    const permissionDisplayNames = {
        camera: 'Camera',
        mediaLibrary: 'Media Library',
        location: 'Location',
        notifications: 'Notifications',
    };

    const checkPermissions = useCallback( async () => {
        const cameraStatus = cameraPermission?.status ?? 'undetermined';
        const { status: mediaLibraryStatus } =
            await MediaLibrary.getPermissionsAsync();
        const { status: locationStatus } =
            await Location.getForegroundPermissionsAsync();
        const { status: notificationsStatus } =
            await Notifications.getPermissionsAsync();

        const updatedPermissions = {
            camera: cameraStatus === 'granted',
            mediaLibrary: mediaLibraryStatus === 'granted',
            location: locationStatus === 'granted',
            notifications: notificationsStatus === 'granted',
        };

        setPermissions(updatedPermissions);

        // Save to Firestore under user's document
        const user = auth.currentUser;
        if (user?.email) {
            try {
                await setDoc(
                    doc(db, 'users', user?.email),
                    { permissions: updatedPermissions },
                    { merge: true },
                );
                console.log('Permissions saved successfully');
            } catch (error) {
                console.error('Error saving permissions:', error);
            }
        }
    }, [cameraPermission]);

    const requestPermission = async (type: PermissionKeys) => {
        let result;
        switch (type) {
            case 'camera':
                result = await requestCameraPermission();
                break;
            case 'mediaLibrary':
                result = await MediaLibrary.requestPermissionsAsync();
                break;
            case 'location':
                result = await Location.requestForegroundPermissionsAsync();
                break;
            case 'notifications':
                result = await Notifications.requestPermissionsAsync();
                break;
        }
        if (result?.status) checkPermissions();
    };

    useEffect(() => {
        checkPermissions();
    }, [cameraPermission, checkPermissions]);

    const openSettings = () => {
        Linking.openSettings();
    };

    return (
        <PermissionsUI
            permissions={permissions}
            requestPermission={requestPermission}
            openSettings={openSettings}
            permissionDisplayNames={permissionDisplayNames}
        />
    );
}
