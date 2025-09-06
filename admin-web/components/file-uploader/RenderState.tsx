import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageOffIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon
                    className={cn(
                        "size-6 text-muted-foreground",
                        isDragActive && "text-primary"
                    )}
                />
            </div>
            <p className="text-base font-semibold ">
                Drop your file here{" "}
                <span className="text-primary font-bold cursor-pointer">
                    or click to select file
                </span>
            </p>

            <Button type="button" className="mt-4 cursor-pointer">
                Select File
            </Button>
        </div>
    );
}

export function RenderErrorState() {
    return (
        <div className=" text-center">
            <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
                <ImageOffIcon
                    className={cn("size-6 text-destructive-foreground")}
                />
            </div>
            <p className="text-base font-semibold text-destructive">
                Upload Failed
            </p>
            <p className="text-xs mt-1">Something went wrong</p>
        </div>
    );
}
