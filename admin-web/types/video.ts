import { FieldValue, Timestamp } from "firebase/firestore";
import { z } from "zod";

// ------------------
// Zod schema
// ------------------
export const VideoSchema = z.object({
    id: z.string().optional(), // id often comes from Firestore
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    videoURL: z.string().url("Must be a valid URL"),
    thumbnailURL: z.string().url("Must be a valid URL"),
    uploadedBy: z.string(),
    uploadedAt: z.any(), // required
    category: z.string(),
    visibility: z.enum(["public", "private"]),
    duration: z.number().nonnegative(),
    views: z.number().nonnegative(),
    topics: z.array(z.string()),
});

// ------------------
// Inferred type from schema
// ------------------
export type Video = z.infer<typeof VideoSchema>;

// ------------------
// Extra props
// ------------------
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
    visibility: "public" | "private" | null;
    setVisibility: React.Dispatch<
        React.SetStateAction<"public" | "private" | null>
    >;
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
    createdAt: Timestamp | FieldValue;
    username: string;
    avatar: string;
};
