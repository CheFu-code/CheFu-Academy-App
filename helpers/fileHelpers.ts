import { Platform } from "react-native";

export const toFileUri = (p = "") =>
    p?.startsWith("file://") ? p : `file://${p}`;

export const isAndroidExternalMedia = (uri = "") =>
    Platform.OS === "android" &&
    (uri.includes("/Android/media/") || uri.includes("Android%2Fmedia"));

export const pathFromUri = (uri = "") => uri.replace(/^file:\/\//, "");
