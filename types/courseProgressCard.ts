import { Course } from "./course";

export interface CourseProgressCardProps {
    item: Course;
    width?: number | string; // Allow both number and string for width
    loading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
}
