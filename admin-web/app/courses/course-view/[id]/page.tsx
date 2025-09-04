"use client";

import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Course } from "@/types/course";
import { BookOpen, Loader } from "lucide-react";
import { toast } from "sonner";

const CourseView = ({ course: initialCourse }: { course?: Course }) => {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id;
    const [course, setCourse] = useState<Course | undefined>(initialCourse);
    const [loading, setLoading] = useState(!initialCourse);
    const { user } = useAuthUser();
    const [completedChaptersState, setCompletedChaptersState] = useState<
        string[]
    >(course?.completedChapter || []);

    useEffect(() => {
        setCompletedChaptersState(course?.completedChapter || []);
    }, [course?.completedChapter]);

    useEffect(() => {
        if (!completedChaptersState.length) return;

        completedChaptersState.forEach((chapterIdx) => {});
    }, [completedChaptersState]);

    useEffect(() => {
        if (!initialCourse && courseId) {
            const fetchCourse = async () => {
                const db = getFirestore();
                const docRef = doc(db, "course", courseId as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists())
                    setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
                setLoading(false);
            };
            fetchCourse();
        }
    }, [courseId, initialCourse]);

    useEffect(() => {
        // Only run after both user and course have loaded
        if (!user || loading) return;

        if (course && course.createdBy !== user.email) {
            toast.error("You are not authorized to view this course!");
            router.replace("/courses");
        }
    }, [user, course, loading, router]);

    const handleChapterClick = async (idx: number) => {
        const isCompleted = completedChaptersState.includes(idx.toString());

        if (!user?.member && isCompleted) {
            toast.warning(
                "Chapter completed, subscribe to revisit this chapter."
            );
            return;
        }

        router.replace(
            `/courses/course-view/${course?.id}/course-learning?chapter=${idx}`
        );
    };

    if (loading)
        return (
            <div className="text-center font-bold mt-9 justify-center items-center flex-col flex h-full">
                <p className="animate-bounce text-green-500">
                    Loading course...
                </p>
                <Loader className="inline-block ml-2 animate-spin" />
            </div>
        );
    if (!course) return <div>Course not found</div>;

    const completedChapters = course.completedChapter?.length || 0;
    const totalChapters = course.chapters?.length || 0;
    const progress =
        totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            {/* Course Banner */}
            {course.banner_image && (
                <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
                    <img
                        src={course.banner_image}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover"
                    />
                    {course.category && (
                        <Badge className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1">
                            {course.category}
                        </Badge>
                    )}
                </div>
            )}

            {/* Course Title & Description */}
            <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {course.courseTitle}
                </h1>
                <div className="text-sm text-muted-foreground flex-row items-center flex gap-2">
                    <BookOpen size={17} />
                    <p>{course.chapters.length} chapters</p>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                    {course.description}
                </p>
            </div>

            {/* Progress */}
            <Card className="p-4">
                <CardHeader className="space-y-2">
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>
                        {completedChapters}/{totalChapters} chapters completed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} className="h-2 rounded-full" />
                </CardContent>
            </Card>

            {/* Chapters List */}
            <div className="space-y-3">
                <h2 className="text-xl font-semibold">Chapters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.chapters.map((chapter, idx) => {
                        const isCompleted = completedChaptersState.includes(
                            idx.toString()
                        );

                        return (
                            <Card
                                key={idx}
                                onClick={() => handleChapterClick(idx)}
                                className={`p-3 cursor-pointer hover:bg-muted/50 transition ${
                                    isCompleted ? "border-green-500" : ""
                                }`}
                            >
                                <CardTitle className="text-sm sm:text-base">
                                    {chapter.chapterName}
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground line-clamp-3">
                                    {chapter.content[0]?.explain as string}
                                </CardDescription>
                                {isCompleted && (
                                    <Badge
                                        variant="secondary"
                                        className="mt-2 bg-green-600 text-white"
                                    >
                                        Completed
                                    </Badge>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CourseView;
