// app/types/course.ts

import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface Flashcard {
    id?: string;
    front: string;
    back: string;
}

export interface ChapterContentItem {
    [key: string]: any;
}

export interface Chapter {
    chapterName: string;
    content: ChapterContentItem[];
}

export interface QA {
    id?: string;
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
