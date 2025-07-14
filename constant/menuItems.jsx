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
  {
    label: "Help & Support",
    icon: "help-circle-outline",
    onPress: () =>
      Linking.openURL(
        "mailto:kurisanimaluleke77@gmail.com?subject=Support Request&body=Please describe your issue here."
      ),
  },

  {
    label: "Terms of Service",
    icon: "document-text-outline",
    onPress: () => router.push("/terms"),
  },
];

export const url =
  "https://play.google.com/store/apps/details?id=com.chefu.chefuacademy";
