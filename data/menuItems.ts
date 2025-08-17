// /data/menuItems.ts
import { Router } from "expo-router";

export const menuItems = (
    router: Router,
    Linking,
    ToastAndroid,
    Colors
) => [
        {
            label: "Add Course",
            icon: "add-circle-outline",
            onPress: () => router.push("/addCourse"),
        },
        {
            label: "Course Progress",
            icon: "stats-chart-outline",
            onPress: () => router.push("/(tabs)/progress"),
        },
        {
            label: "Completed Courses",
            icon: "checkmark-circle",
            onPress: () => router.push("/completedCourses" as any),
        },
        {
            label: "Downloaded Courses",
            icon: "download-outline",
            onPress: () => router.push("/download"),
        },
    ];

export const url =
    "https://play.google.com/store/apps/details?id=com.chefu.chefuacademy";
