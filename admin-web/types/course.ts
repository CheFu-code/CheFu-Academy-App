// app/types/course.ts

import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface Flashcard {
    front: string;
    back: string;
}

export interface ChapterContentItem {
    [key: string]: unknown;
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
    createdOn?: FirebaseFirestoreTypes.Timestamp; 
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
