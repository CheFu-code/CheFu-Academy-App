"use client";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuthUser";
import { getCourses } from "@/lib/getCourses";
import { Course } from "@/types/course";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const { user, loading } = useAuthUser();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const data = await getCourses();
            setCourses(data);
        })();
    }, []);

    return (
        <div className="min-h-screen px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Courses</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {courses.length > 0 ? (
                    courses.map((c) => (
                        <Card
                            key={c.id}
                            className="hover:shadow-lg transition-shadow duration-200 rounded-2xl"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold truncate">
                                    {c.courseTitle}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {c.description ||
                                        "No description available."}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500">
                        No courses found.
                    </p>
                )}
            </div>
        </div>
    );
}
