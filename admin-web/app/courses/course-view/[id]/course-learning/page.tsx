"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Course } from "@/types/course";
import {
    arrayUnion,
    doc,
    getDoc,
    getFirestore,
    updateDoc,
} from "firebase/firestore";
import hljs from "highlight.js";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

const CourseLearning = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthUser();
    const courseId = params.id;
    const initialChapterIndex = Number(searchParams.get("chapter") || 0);

    const [course, setCourse] = useState<Course | null>(null);
    const [chapterIndex, setChapterIndex] = useState(initialChapterIndex);
    const [contentIndex, setContentIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            const db = getFirestore();
            const docRef = doc(db, "course", courseId as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
            } else {
                console.error("Course not found:", courseId);
            }
        };
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        if (!user || loading) return;
        if (course?.createdBy !== user.email) {
            toast.error("You are not authorized to view this course!");
            router.replace("/courses");
        }
    }, [course, user, router, loading]);

    if (!course)
        return (
            <div className="text-center font-bold flex justify-center items-center h-full">
                Loading...
            </div>
        );

    const chapter = course.chapters[chapterIndex];
    if (!chapter)
        return (
            <div className="text-center font-bold flex justify-center items-center mt-8">
                Chapter not found!
            </div>
        );

    const totalContents = chapter.content.length;
    const progressPercent = (contentIndex + 1) / totalContents;

    const handleNext = () => {
        if (contentIndex + 1 < totalContents) {
            setContentIndex(contentIndex + 1);
        }
    };

    const handleFinish = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const db = getFirestore();
            const courseRef = doc(db, "course", course.id);
            await updateDoc(courseRef, {
                completedChapter: arrayUnion(chapterIndex.toString()),
            });
            toast.success(
                "Chapter completed! Redirecting to course overview..."
            );
            router.replace(`/courses/course-view/${course.id}`);
        } catch (err) {
            console.error(err);
            toast.error("Error completing chapter!");
        } finally {
            setLoading(false);
        }
    };

    const content = chapter.content[contentIndex];
    const code = content.code || "";
    const cleanCode = code
        ? code.replace(/^```[\w]*\n/, "").replace(/```$/, "")
        : "";
    const detectedLanguage = hljs.highlightAuto(code).language || "javascript";

    return (
        <div className="p-4 max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">{chapter.chapterName}</h1>

            <Progress value={progressPercent * 100} />
            <p className="text-sm text-muted-foreground mt-1">
                Lesson {contentIndex + 1} of {totalContents}
            </p>

            <div className="space-y-4">
                {content.topic && (
                    <h2 className="text-xl font-semibold">{content.topic}</h2>
                )}
                {content.explain && (
                    <p className="text-muted-foreground">{content.explain}</p>
                )}
                {cleanCode && (
                    <SyntaxHighlighter
                        language={detectedLanguage}
                        style={vscDarkPlus}
                        showLineNumbers
                        wrapLongLines
                        customStyle={{
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            fontSize: "0.875rem",
                            fontFamily: "Fira Code, monospace",
                            overflowX: "auto",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                    >
                        {cleanCode}
                    </SyntaxHighlighter>
                )}

                {content.example && (
                    <div className="pt-2 border-t border-muted-foreground/20 bg-green-900 p-2 rounded-2xl">
                        <h4 className="text-lg font-semibold">Example:</h4>
                        <p className="text-muted-foreground">
                            <span className="font-mono text-gray-400">
                                {content.example}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            <Button
                className="hover:bg-blue-700"
                onClick={
                    contentIndex + 1 === totalContents
                        ? handleFinish
                        : handleNext
                }
                disabled={loading}
            >
                {loading
                    ? "Loading..."
                    : contentIndex + 1 === totalContents
                    ? "Finish"
                    : "Next"}
            </Button>
        </div>
    );
};

export default CourseLearning;
