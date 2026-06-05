import PermissionsUI from '@/component/Setting/PermissionsUI';
import { permissionDisplayNames } from '@/constant/random';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import { PermissionKeys } from '@/types/permissions';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';

export default function Permissions() {
    const { userDetail } = useContext(UserDetailContext);
    const [cameraPermission, requestCameraPermission] =
        Camera.useCameraPermissions();

    const [permissions, setPermissions] = useState({
        camera: false,
        mediaLibrary: false,
        location: false,
        notifications: false,
    });

    const checkPermissions = useCallback(async () => {
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

        if (userDetail?.email) {
            try {
                await chefuApiClient.put('/api/academy/mobile/permissions', {
                    permissions: updatedPermissions,
                });
            } catch (error) {
                console.error('Error saving permissions:', error);
            }
        }
    }, [cameraPermission, userDetail?.email]);

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
