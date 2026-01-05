import { PermissionsAndroid, Platform } from 'react-native';

export async function requestStoragePermission() {
    if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Storage Permission Required',
                message:
                    'This app needs access to your storage to save receipts',
                buttonPositive: 'OK',
            },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
}
