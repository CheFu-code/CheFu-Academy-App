import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type Video = {
    id: string;
    title: string;
    instructorCompany: string;
    instructorName: string;
    description: string;
    videoURL: string;
    thumbnailURL: string;
    uploadedBy: string;
    uploadedAt: FirebaseFirestoreTypes.Timestamp;
    category: string;
    visibility: "public" | "private";
    level: "beginner" | "advance";
    duration: number;   // in seconds
    views: number;      // view count
    topics: string[];
};

export type YouTubeVideo = {
    createdAt: FirebaseFirestoreTypes.Timestamp;
    thumbnailURL: string;
    title: string;
    videoId: string;
    description: string;
    duration: string;
    views: number;
    publishedAt: Date;
    instructorName: string;        // channel name
    instructorCompany: string;     // optional creative name
    channelTitle: string;          // add this for TypeScript
    category: string
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
    instructorCompany: string;
    setInstructorCompany: (text: string) => void;
    instructorName: string;
    setInstructorName: (text: string) => void;
    description: string;
    setDescription: (text: string) => void;
    category: string | null;
    setCategory: (cat: string | null) => void;
    visibility: string | null;
    setVisibility: React.Dispatch<React.SetStateAction<"public" | "private" | null>>;
    level: "advance" | "beginner" | null;
    setLevel: React.Dispatch<React.SetStateAction<"advance" | "beginner" | null>>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    duration: number;
    setDuration: (d: number) => void;
    views: number;
    setViews: (views: number) => void;
    topics: string[];
    setTopics: (topics: string[]) => void;
};

export type UserReviews = {
    id: string;
    videoId: string;
    email: string;
    userId: string;
    rating: number; // 1 to 5
    comment: string;
    createdAt: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue;
    username: string;
    avatar: string;
}

export interface FavoriteCourse {
    videoId: string;
    title: string;
    thumbnailURL: string;
    addedAt: FirebaseFirestoreTypes.Timestamp;
    uploadedBy: string
}