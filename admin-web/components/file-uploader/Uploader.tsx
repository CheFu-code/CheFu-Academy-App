"use client";

import { UploaderState } from "@/types/video";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "../ui/card";
import { RenderEmptyState } from "./RenderState";

const Uploader = ({ type }: { type: "image" | "video" }) => {
    const [fileState, setFileState] = useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image",
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            setFileState((prev) => ({
                ...prev,
                id: uuidv4(),
                file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                fileType: file.type.includes("image") ? "image" : "video",
                isDeleting: false,
                error: false,
            }));
        }
    }, []);

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find(
                (rejection) => rejection.errors[0].code === "too-many-files"
            );
            const fileSizeTooBig = fileRejection.find(
                (rejection) => rejection.errors[0].code === "file-too-large"
            );

            if (fileSizeTooBig) {
                toast.error("File size too big, max is 5MB");
            }
            if (tooManyFiles) {
                toast.error("Too many files selected, max is 1");
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: type === "image" ? { "image/*": [] } : { "video/*": [] },
        maxFiles: 1,
        multiple: false,
        onDropRejected: rejectedFiles,
    });
    return (
        <Card
            {...getRootProps()}
            className="relative border-2 border-dashed w-full h-64"
        >
            <input {...getInputProps()} />
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                {fileState.objectUrl ? (
                    type === "image" ? (
                        <img
                            src={fileState.objectUrl}
                            alt="preview"
                            className="max-h-full"
                        />
                    ) : (
                        <video
                            src={fileState.objectUrl}
                            controls
                            className="max-h-full"
                        />
                    )
                ) : (
                    <RenderEmptyState isDragActive={isDragActive} />
                )}
            </CardContent>
        </Card>
    );
};

export default Uploader;
