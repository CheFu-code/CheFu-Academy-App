// courseDownloadHelpers.ts
import * as Application from "expo-application";
import { NativeModules, PermissionsAndroid, Platform } from "react-native";
import RNFS from "react-native-fs";

const PACKAGE_NAME = Application.applicationId || "com.chefucademy.app";

export async function ensureLegacyWritePermission() {
    if (Platform.OS !== "android") return true;
    if (Platform.Version <= 29) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
}

export async function savePDFToAppMediaFolder(
    localFileUri: string,
    fileName: string
) {
    const basePath = `/storage/emulated/0/Android/media/${PACKAGE_NAME}/CheFu Academy/Downloads`;
    await RNFS.mkdir(basePath, { intermediates: true } as any);

    const sourcePath = localFileUri.replace(/^file:\/\//, "");
    const destPath = `${basePath}/${fileName}`;
    await RNFS.copyFile(sourcePath, destPath);
    return destPath;
}

export function scanFile(path: string) {
    try {
        const { RNFetchBlob } = NativeModules;
        if (RNFetchBlob?.fs?.scanFile) {
            RNFetchBlob.fs.scanFile([{ path, mime: "application/pdf" }]);
        }
    } catch (e) {
        console.warn("Media scan error:", e);
    }
}
