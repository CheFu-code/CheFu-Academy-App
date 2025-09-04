import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const VideosCreationPage = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Videos</h1>

                <Link href="/admin/videos/upload-video" className={buttonVariants()}>
                    Upload Video
                </Link>
            </div>

            <div>here we&apos;ll display all videos</div>
        </>
    );
};

export default VideosCreationPage;
