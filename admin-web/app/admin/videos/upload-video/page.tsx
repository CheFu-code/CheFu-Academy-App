"use client";

import Uploader from "@/components/file-uploader/Uploader";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    levelOptions,
    VideoCategoryValues,
    VisibilityOptions,
} from "@/constants/Options";
import { uploadFile, uploadVideo } from "@/services/videoService";
import {
    UploaderState,
    UploadFormProps,
    Video,
    VideoSchema,
} from "@/types/video";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { PlusIcon, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UploadVideoPage = ({
    videoUri,
    setVideoUri,
    thumbnailUri,
    setThumbnailUri,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    visibility,
    setVisibility,
    level,
    setLevel,
    loading,
    setLoading,
    duration,
    setDuration,
    views,
    setViews,
    topics = [],
    setTopics,
}: UploadFormProps) => {
    const [newTopic, setNewTopic] = useState("");
    const [fileState, setFileState] = useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image",
    });

    const addTopic = (field: any) => {
        const topic = newTopic.trim();
        if (topic && !field.value.includes(topic)) {
            field.onChange([...(field.value || []), topic]);
            setNewTopic("");
        }
    };

    const form = useForm<Video>({
        resolver: zodResolver(VideoSchema), // ✅ Use Zod schema here
        defaultValues: {
            title: "",
            description: "",
            videoURL: "",
            thumbnailURL: "",
            uploadedBy: "",
            uploadedAt: Timestamp.now(),
            category: "",
            visibility: "public",
            level: "beginner",
            duration: 0,
            views: 0,
            topics: [],
        },
    });

    function onSubmit(values: Video) {
        console.log(values);
    }

    const handleUpload = async () => {
        if (
            !fileState.file ||
            !title ||
            !description ||
            topics.length === 0 ||
            !videoUri ||
            !thumbnailUri ||
            !category ||
            !visibility ||
            !level
        )
            return;

        try {
            setLoading(true);

            let videoURL = videoUri;
            let thumbnailURL = thumbnailUri;

            // Upload thumbnail if not uploaded yet
            if (fileState.fileType === "image" && fileState.file) {
                const uploadedThumbnailURL = await uploadFile(
                    fileState.file,
                    `thumbnails/${Date.now()}-${fileState.file.name}`
                );
                thumbnailURL = uploadedThumbnailURL;
                setThumbnailUri(uploadedThumbnailURL); // update state
            }

            // Upload video if not uploaded yet
            if (fileState.fileType === "video" && fileState.file) {
                const uploadedVideoURL = await uploadFile(
                    fileState.file,
                    `videos/${Date.now()}-${fileState.file.name}`
                );
                videoURL = uploadedVideoURL;
                setVideoUri(uploadedVideoURL); // update state
            }

            // Now call your service with real URLs
            await uploadVideo(
                title,
                description,
                videoURL,
                thumbnailURL,
                category,
                visibility,
                level,
                duration,
                0,
                topics
            );

            toast.success("Video uploaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Provide basic information about the video you want to
                        upload.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Title..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-[120px]"
                                                placeholder="Description..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="thumbnailURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Uploader type="image" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="videoURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video</FormLabel>
                                        <FormControl>
                                            <Uploader type="video" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {VideoCategoryValues.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="visibility"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Visibility</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Value" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {VisibilityOptions.map(
                                                        (visibility) => (
                                                            <SelectItem
                                                                key={visibility}
                                                                value={
                                                                    visibility
                                                                }
                                                            >
                                                                {visibility}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Level</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Value" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {levelOptions.map(
                                                        (level) => (
                                                            <SelectItem
                                                                key={level}
                                                                value={level}
                                                            >
                                                                {level}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="topics"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Topics</FormLabel>

                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter topics..."
                                                    value={newTopic}
                                                    onChange={(e) =>
                                                        setNewTopic(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={
                                                        (e) =>
                                                            e.key === "Enter" &&
                                                            (e.preventDefault(),
                                                            addTopic(field)) // ✅ use form state
                                                    }
                                                />
                                            </FormControl>
                                            {newTopic.trim() && (
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        addTopic(field)
                                                    }
                                                >
                                                    Add
                                                </Button>
                                            )}
                                        </div>

                                        {/* Show selected topics */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {field.value?.map(
                                                (t: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 rounded bg-gray-600 text-sm flex items-center"
                                                    >
                                                        {t}
                                                        <button
                                                            type="button"
                                                            className="ml-1 bg-red-400 rounded-2xl cursor-pointer"
                                                            onClick={() =>
                                                                field.onChange(
                                                                    field.value.filter(
                                                                        (
                                                                            _: string,
                                                                            idx: number
                                                                        ) =>
                                                                            idx !==
                                                                            i
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            <X className="size-4" />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button onClick={handleUpload} disabled={loading}>
                                {loading ? "Uploading..." : "Upload Video"}{" "}
                                <PlusIcon className="size-3.5" />
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
};

export default UploadVideoPage;
