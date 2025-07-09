export const PracticeOption = [
  {
    name: "Quiz",
    image: require("./../assets/images/quizz.png"),
    icon: require("./../assets/images/quiz.png"),
    path: "/quiz",
  },
  {
    name: "Flashcards",
    image: require("./../assets/images/flashcard.png"),
    icon: require("./../assets/images/layers.png"),
    path: "/flashcards",
  },
  {
    name: "Question & Ans",
    image: require("./../assets/images/notes.png"),
    icon: require("./../assets/images/qa.png"),
    path: "/questionAnswer",
  },
];

export const imageAssets = {
  "/banner1.png": require("./../assets/images/banner1.png"),
  "/banner2.png": require("./../assets/images/banner2.png"),
  "/banner3.png": require("./../assets/images/banner3.png"),
  "/banner4.png": require("./../assets/images/banner4.png"),
  "/banner5.png": require("./../assets/images/banner5.png"),
  "/banner6.png": require("./../assets/images/banner6.png"),
};

export const CourseCategory = [
  "Tech & Coding",
  "Business & Finance",
  "Health & Fitness",
  "Science & Engineering",
  "Arts & Creativity",
  "Language & Communication",
  "Personal Development",
  "History & Culture",
  "Math & Logic",
  "Education & Teaching",
  "Lifestyle & Hobbies",
  "Marketing & Sales",
  "Design & UX",
  "Law & Government",
  "Environment & Sustainability",
  "Photography & Videography",
  "Music & Audio",
  "Food & Cooking",
  "Travel & Adventure",
  "Sports & Recreation",
  "Parenting & Family",
  "Psychology & Mental Health",
  "Writing & Literature",
  "Religion & Spirituality",
  "Automotive & Vehicles",
  "Real Estate & Property",
  "Science Fiction & Fantasy",
  "Gaming & Esports",
  "Crafts & DIY",
  "Technology & Gadgets",
  "Investing & Trading",
  "Human Resources & Recruiting",
  "Economics & Policy",
  "Public Speaking & Presentation",
  "Data Science & Analytics",
  "Artificial Intelligence & Machine Learning",
  "Cybersecurity",
  "Blockchain & Cryptocurrency",
  "Graphic Design",
  "Animation & Motion Graphics",
  "Interior Design",
  "Fashion & Beauty",
  "Entrepreneurship",
  "Customer Service & Support",
  "Project Management",
  "Language Learning",
  "Social Media",
  "Career Development",
  "Sustainability & Green Tech",
];

export const ProfileMenu = [
  {
    name: "Add Course",
    icon: "add-outline", //Ionic Icons
    path: "/addCourse",
  },
  {
    name: "My Course",
    icon: "book", //Ionic Icons
    path: "/(tabs)/home",
  },
  {
    name: "Course Progress",
    icon: "analytics-outline", //Ionic Icons
    path: "/(tabs)/progress",
  },
  {
    name: "My Subscription",
    icon: "shield-checkmark", //Ionic Icons
    path: "",
  },
  {
    name: "Logout",
    icon: "log-out", //Ionic Icons
    path: "/login",
  },
];
