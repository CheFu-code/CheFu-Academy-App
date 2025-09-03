"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { imageAssets } from "@/constants/Options";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Course } from "@/types/course";
import { User as FirebaseUser, getAuth } from "firebase/auth";
import {
    collection,
    getDocs,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading } = useAuthUser();
    const router = useRouter();

    const fetchCourses = async (user: FirebaseUser) => {
        try {
            const db = getFirestore();
            const q = query(
                collection(db, "course"),
                where("createdBy", "==", user.email)
            );
            const snapshot = await getDocs(q);

            const fetchedCourses: Course[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    docId: doc.id,
                    banner_image: data.banner_image || "",
                    category: data.category || "",
                    chapters: data.chapters || [],
                    courseTitle: data.courseTitle || "",
                    createdBy: data.createdBy || "",
                    createdOn: data.createdOn,
                    description: data.description || "",
                    enrolled: data.enrolled || false,
                    flashcards: data.flashcards || [],
                    qa: data.qa || [],
                    quiz: data.quiz || [],
                    completedChapter: data.completedChapter || [],
                };
            });

            setCourses(fetchedCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            if (user) fetchCourses(user);
            else setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Only run this after both user and courses are loaded
        if (userLoading || loading) return;

        if (!user) {
            router.replace("/courses");
            return;
        }

        if (courses.length > 0 && courses[0].createdBy !== user.email) {
            toast.error("You are not authorized to view this course!");
            router.replace("/courses");
        }
    }, [courses, user, userLoading, loading, router]);

    const handleClick = (id: string) => {
        router.push(`/courses/course-view/${id}`);
    };

    if (loading)
        return (
            <div className="flex items-center justify-center h-full p-4">
                <p className="font-bold text-base sm:text-lg animate-pulse mr-2">
                    Loading courses...
                </p>
                <Loader className="animate-spin text-blue-600" />
            </div>
        );

    if (courses.length === 0)
        return (
            <div className="flex items-center justify-center h-full p-4">
                <p className="font-bold text-base sm:text-lg">
                    No courses yet.
                </p>
            </div>
        );

    return (
        <Card className="space-y-3">
            <CardHeader className="px-3 pt-3">
                <CardTitle className="text-base sm:text-lg">
                    My Courses
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Your active learning journey
                </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => {
                    const completedChapters =
                        course?.completedChapter?.length || 0;
                    const totalChapters = course.chapters.length;
                    const progress =
                        totalChapters > 0
                            ? (completedChapters / totalChapters) * 100
                            : 0;

                    return (
                        <Card
                            key={course.id}
                            onClick={() => handleClick(course.id)}
                            className={` cursor-pointer hover:bg-muted/50 transition ${
                                completedChapters === totalChapters
                                    ? "border-green-500"
                                    : ""
                            }`}
                        >
                            {course.banner_image && (
                                <div className="relative w-full h-24 sm:h-32 md:h-36 overflow-hidden rounded-t-md">
                                    <img
                                        src={imageAssets[course.banner_image]}
                                        alt={course.courseTitle}
                                        className="w-full h-full object-cover"
                                    />
                                    {course.category && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute top-1 left-1 text-[10px] sm:text-xs px-1 py-0.5 shadow-md bg-green-600"
                                        >
                                            <span className="text-white">
                                                {course.category}
                                            </span>
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <CardHeader className="space-y-1 px-3 pt-2">
                                <CardTitle className="text-sm sm:text-base truncate">
                                    {course.courseTitle}
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground">
                                    {totalChapters} chapter
                                    {totalChapters !== 1 ? "s" : ""}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2 px-3 pb-3 flex flex-col flex-1 justify-end">
                                <Progress
                                    value={progress}
                                    className="h-1.5 sm:h-2 rounded-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {completedChapters}/{totalChapters}{" "}
                                    completed
                                </p>
                                {completedChapters === totalChapters && (
                                    <Badge
                                        variant="secondary"
                                        className=" bg-green-600 text-white"
                                    >
                                        Completed
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </CardContent>
        </Card>
    );
}
