// app/types/course.ts

import { Timestamp } from "firebase/firestore";

export interface Flashcard {
    front: string;
    back: string;
}

export interface ChapterContentItem {
    topic?: string;
    explain?: string;
    code?: string;
    example?: string;
}

export interface Chapter {
    chapterName: string;
    content: ChapterContentItem[];
}

export interface QA {
    question: string;
    answer: string;
}

export interface Quiz {
    question: string;
    options: string[];
    correctAns: string;
}

export interface Course {
    id: string;
    banner_image: string;
    category: string;
    chapters: Chapter[];
    courseTitle: string;
    createdBy: string;
    createdOn?: Timestamp;
    description: string;
    docId: string;
    enrolled: boolean;
    flashcards: Flashcard[];
    qa: QA[];
    quiz: Quiz[];
    completedChapter?: string[];

}

export interface CourseProgressProps {
    courseList: Course[];
    enroll?: boolean;
}
