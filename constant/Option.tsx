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

export const imageAssets: Record<string, any> = {
    "/banner1.png": require("../assets/images/banner1.png"),
    "/banner2.png": require("../assets/images/banner2.png"),
    "/banner3.png": require("../assets/images/banner3.png"),
    "/banner4.png": require("../assets/images/banner4.png"),
    "/banner5.png": require("../assets/images/banner5.png"),
    "/banner6.png": require("../assets/images/banner6.png"),
    "/tech-coding.png": require("../assets/images/tech-coding.png"),
    "/science-engineering.png": require("../assets/images/science-engineering.png"),
    "/business-finance.png": require("../assets/images/business-finance.png"),
    "/health-fitness.png": require("../assets/images/health-fitness.png"),
    "/arts-creativity.png": require("../assets/images/arts-creativity.png"),
    "/language-communication.png": require("../assets/images/language-communication.png"),
    "/personal-development.png": require("../assets/images/personal-development.png"),
    "/history-culture.png": require("../assets/images/history-culture.png"),
    // "/math-logic.png": require("../assets/images/math-logic.png"),
    // "/education-teaching.png": require("../assets/images/education-teaching.png"),
    // "/lifestyle-hobbies.png": require("../assets/images/lifestyle-hobbies.png"),
    // "/marketing-sales.png": require("../assets/images/marketing-sales.png"),
    // "/design-ux.png": require("../assets/images/design-ux.png"),
    // "/law-government.png": require("../assets/images/law-government.png"),
    // "/environment-sustainability.png": require("../assets/images/environment-sustainability.png"),
    // "/photography-videography.png": require("../assets/images/photography-videography.png"),
    // "/music-audio.png": require("../assets/images/music-audio.png"),
    // "/food-cooking.png": require("../assets/images/food-cooking.png"),
    // "/travel-adventure.png": require("../assets/images/travel-adventure.png"),
    // "/sports-recreation.png": require("../assets/images/sports-recreation.png"),
    // "/parenting-family.png": require("../assets/images/parenting-family.png"),
    // "/psychology-mental-health.png": require("../assets/images/psychology-mental-health.png"),
    // "/writing-literature.png": require("../assets/images/writing-literature.png"),
    // "/religion-spirituality.png": require("../assets/images/religion-spirituality.png"),
    // "/automotive-vehicles.png": require("../assets/images/automotive-vehicles.png"),
    // "/real-estate-property.png": require("../assets/images/real-estate-property.png"),
    // "/science-fiction-fantasy.png": require("../assets/images/science-fiction-fantasy.png"),
    // "/gaming-esports.png": require("../assets/images/gaming-esports.png"),
    // "/crafts-diy.png": require("../assets/images/crafts-diy.png"),
    // "/technology-gadgets.png": require("../assets/images/technology-gadgets.png"),
    // "/investing-trading.png": require("../assets/images/investing-trading.png"),
    // "/human-resources-recruiting.png": require("../assets/images/human-resources-recruiting.png"),
    // "/economics-policy.png": require("../assets/images/economics-policy.png"),
    // "/public-speaking-presentation.png": require("../assets/images/public-speaking-presentation.png"),
    // "/data-science-analytics.png": require("../assets/images/data-science-analytics.png"),
    // "/artificial-intelligence-machine-learning.png": require("../assets/images/artificial-intelligence-machine-learning.png"),
    // "/cybersecurity.png": require("../assets/images/cybersecurity.png"),
    // "/blockchain-cryptocurrency.png": require("../assets/images/blockchain-cryptocurrency.png"),
    // "/graphic-design.png": require("../assets/images/graphic-design.png"),
    // "/animation-motion-graphics.png": require("../assets/images/animation-motion-graphics.png"),
    // "/interior-design.png": require("../assets/images/interior-design.png"),
    // "/fashion-beauty.png": require("../assets/images/fashion-beauty.png"),
    // "/entrepreneurship.png": require("../assets/images/entrepreneurship.png"),
    // "/customer-service-support.png": require("../assets/images/customer-service-support.png"),
    // "/project-management.png": require("../assets/images/project-management.png"),
    // "/language-learning.png": require("../assets/images/language-learning.png"),
    // "/social-media.png": require("../assets/images/social-media.png"),
    // "/career-development.png": require("../assets/images/career-development.png"),
    // "/sustainability-green-tech.png": require("../assets/images/sustainability-green-tech.png"),
};

export const CourseCategory = [
    "Tech & Coding", //
    "Business & Finance", //
    "Health & Fitness", //
    "Science & Engineering", //
    "Arts & Creativity", //
    "Language & Communication", //
    "Personal Development", //
    "History & Culture", //
    "Math & Logic", //
    "Education & Teaching", //
    "Lifestyle & Hobbies", //
    "Marketing & Sales", //
    "Design & UX", //
    "Law & Government", //
    "Environment & Sustainability", //
    "Photography & Videography", //
    "Music & Audio", //
    "Food & Cooking", //
    "Travel & Adventure", //
    "Sports & Recreation", //
    "Parenting & Family", //
    "Psychology & Mental Health", //
    "Writing & Literature", //
    "Religion & Spirituality", //
    "Automotive & Vehicles", //
    "Real Estate & Property", //
    "Science Fiction & Fantasy", //
    "Gaming & Esports", //
    "Crafts & DIY", //
    "Technology & Gadgets", //
    "Investing & Trading", //
    "Human Resources & Recruiting", //
    "Economics & Policy", //
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
