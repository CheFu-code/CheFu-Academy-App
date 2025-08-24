import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type Video = {
    id: string;
    title: string;
    description: string;
    videoURL: string;
    thumbnailURL: string;
    uploadedBy: string;
    uploadedAt: FirebaseFirestoreTypes.Timestamp;
    category: string;
    visibility: "public" | "private";
};

export type VideoCardProps = {
    video: Video;
    onPress?: () => void;
};

export type UploadFormProps = {
    videoUri: string | null;
    setVideoUri: (uri: string | null) => void;
    thumbnailUri: string | null;
    setThumbnailUri: (uri: string | null) => void;
    title: string;
    setTitle: (text: string) => void;
    description: string;
    setDescription: (text: string) => void;
    category: string | null;
    setCategory: (cat: string | null) => void;
    visibility: string | null;
    setVisibility: (vis: string | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};