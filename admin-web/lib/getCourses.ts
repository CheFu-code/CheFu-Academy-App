import { db } from "@/lib/firebase";
import { Course } from "@/types/course";
import { collection, getDocs } from "firebase/firestore";

// 🔹 Fetch all courses
export async function getCourses(): Promise<Course[]> {
    try {
        const snapshot = await getDocs(collection(db, "course"));

        const courses: Course[] = snapshot.docs.map((doc) => {
            const d = doc.data();
            return {
                id: doc.id,
                docId: doc.id, // optional
                banner_image: d.banner_image || "",
                courseTitle: d.courseTitle || "",
                description: d.description || "",
                category: d.category || "",
                uploadedBy: d.uploadedBy || "",
                createdBy: d.createdBy || "",
                chapters: d.chapters || [],
                flashcards: d.flashcards || [],
                qa: d.qa || [],
                quiz: d.quiz || [],
                enrolled: d.enrolled || [],
                createdAt: d.createdAt ? d.createdAt.toDate().toLocaleString() : "",
            } as Course;
        });

        return courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}
