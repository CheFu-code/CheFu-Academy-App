// /data/menuItems.js
export const menuItems = (router, Linking, ToastAndroid, Colors) => [
    {
        label: "Add Course",
        icon: "add-circle-outline",
        onPress: () => router.push("/addCourse"),
    },
    {
        label: "My Courses",
        icon: "book-outline",
        onPress: () => router.push("/(tabs)/home"),
    },
    {
        label: "Course Progress",
        icon: "stats-chart-outline",
        onPress: () => router.push("/(tabs)/progress"),
    },
];

export const url =
    "https://play.google.com/store/apps/details?id=com.chefu.chefuacademy";
