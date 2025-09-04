import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Courses</h1>

                <Link href="/admin/courses/create" className={buttonVariants()}>
                    Create Course
                </Link>
            </div>

            <div>
                here we&apos;ll display all courses
            </div>
        </>
    );
}
