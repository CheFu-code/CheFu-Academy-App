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
    // "/banner1.png": require("../assets/images/banner1.png"),
    // "/banner2.png": require("../assets/images/banner2.png"),
    // "/banner3.png": require("../assets/images/banner3.png"),
    // "/banner4.png": require("../assets/images/banner4.png"),
    // "/banner5.png": require("../assets/images/banner5.png"),
    // "/banner6.png": require("../assets/images/banner6.png"),
    "/tech-coding.jpg": require("../assets/images/tech-coding.jpg"),
    "/science-engineering.png": require("../assets/images/science-engineering.png"),
    "/business-finance.jpg": require("../assets/images/business-finance.jpg"),
    "/health-fitness.png": require("../assets/images/health-fitness.png"),
    "/arts-creativity.png": require("../assets/images/arts-creativity.png"),
    "/language-communication.png": require("../assets/images/language-communication.png"),
    "/personal-development.png": require("../assets/images/personal-development.png"),
    "/history-culture.png": require("../assets/images/history-culture.png"),
    "/math-logic.webp": require("../assets/images/math-logic.webp"),
    "/education-teaching.webp": require("../assets/images/education-teaching.webp"),
    "/lifestyle-hobbies.webp": require("../assets/images/lifestyle-hobbies.webp"),
    "/marketing-sales.webp": require("../assets/images/marketing-sales.webp"),
    "/design-ux.jpg": require("../assets/images/design-ux.jpg"),
    "/law-government.jpeg": require("../assets/images/law-government.jpeg"),
    "/environment-sustainability.jpg": require("../assets/images/environment-sustainability.jpg"),
    "/photography-videography.jpg": require("../assets/images/photography-videography.jpg"),
    "/music-audio.jpg": require("../assets/images/music-audio.jpg"),
    "/food-cooking.jpg": require("../assets/images/food-cooking.jpg"),
    "/travel-adventure.jpg": require("../assets/images/travel-adventure.jpg"),
    "/sports-recreation.jpg": require("../assets/images/sports-recreation.jpg"),
    "/parenting-family.jpg": require("../assets/images/parenting-family.jpg"),
    "/psychology-mental-health.jpg": require("../assets/images/psychology-mental-health.jpg"),
    "/writing-literature.webp": require("../assets/images/writing-literature.webp"),
    "/religion-spirituality.webp": require("../assets/images/religion-spirituality.webp"),
    "/automotive-vehicles.jpg": require("../assets/images/automotive-vehicles.jpg"),
    "/real-estate-property.webp": require("../assets/images/real-estate-property.webp"),
    "/science-fiction-fantasy.webp": require("../assets/images/science-fiction-fantasy.webp"),
    "/gaming-esports.webp": require("../assets/images/gaming-esports.webp"),
    "/crafts-diy.jpg": require("../assets/images/crafts-diy.jpg"),
    "/technology-gadgets.png": require("../assets/images/technology-gadgets.png"),
    "/investing-trading.jpg": require("../assets/images/investing-trading.jpg"),
    "/human-resources-recruiting.jpeg": require("../assets/images/human-resources-recruiting.jpeg"),
    "/economics-policy.webp": require("../assets/images/economics-policy.webp"),
    "/public-speaking-presentation.jpg": require("../assets/images/public-speaking-presentation.jpg"),
    "/data-science-analytics.jpg": require("../assets/images/data-science-analytics.jpg"),
    "/artificial-intelligence-machine-learning.jpg": require("../assets/images/artificial-intelligence-machine-learning.jpg"),
    "/cybersecurity.jpg": require("../assets/images/cybersecurity.jpg"),
    "/blockchain-cryptocurrency.jpg": require("../assets/images/blockchain-cryptocurrency.jpg"),
    "/graphic-design.jpg": require("../assets/images/graphic-design.jpg"),
    "/animation-motion-graphics.jpg": require("../assets/images/animation-motion-graphics.jpg"),
    "/interior-design.jpg": require("../assets/images/interior-design.jpg"),
    "/fashion-beauty.jpg": require("../assets/images/fashion-beauty.jpg"),
    "/entrepreneurship.jpg": require("../assets/images/entrepreneurship.jpg"),
    "/customer-service-support.jpg": require("../assets/images/customer-service-support.jpg"),
    "/project-management.webp": require("../assets/images/project-management.webp"),
    "/language-learning.png": require("../assets/images/language-learning.png"),
    "/social-media.webp": require("../assets/images/social-media.webp"),
    "/career-development.jpg": require("../assets/images/career-development.jpg"),
    "/sustainability-green-tech.png": require("../assets/images/sustainability-green-tech.png"),
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

export const VideoCategory = [
    { label: "Tech & Coding", value: "Tech & Coding" },
    { label: "Business & Finance", value: "Business & Finance" },
    { label: "Health & Fitness", value: "Health & Fitness" },
    { label: "Science & Engineering", value: "Science & Engineering" },
    { label: "Arts & Creativity", value: "Arts & Creativity" },
    { label: "Language & Communication", value: "Language & Communication" },
    { label: "Personal Development", value: "Personal Development" },
    { label: "History & Culture", value: "History & Culture" },
    { label: "Math & Logic", value: "Math & Logic" },
    { label: "Education & Teaching", value: "Education & Teaching" },
    { label: "Lifestyle & Hobbies", value: "Lifestyle & Hobbies" },
    { label: "Marketing & Sales", value: "Marketing & Sales" },
    { label: "Design & UX", value: "Design & UX" },
    { label: "Law & Government", value: "Law & Government" },
    {
        label: "Environment & Sustainability",
        value: "Environment & Sustainability",
    },
    { label: "Photography & Videography", value: "Photography & Videography" },
    { label: "Music & Audio", value: "Music & Audio" },
    { label: "Food & Cooking", value: "Food & Cooking" },
    { label: "Travel & Adventure", value: "Travel & Adventure" },
    { label: "Sports & Recreation", value: "Sports & Recreation" },
    { label: "Parenting & Family", value: "Parenting & Family" },
    {
        label: "Psychology & Mental Health",
        value: "Psychology & Mental Health",
    },
    { label: "Writing & Literature", value: "Writing & Literature" },
    { label: "Religion & Spirituality", value: "Religion & Spirituality" },
    { label: "Automotive & Vehicles", value: "Automotive & Vehicles" },
    { label: "Real Estate & Property", value: "Real Estate & Property" },
    { label: "Science Fiction & Fantasy", value: "Science Fiction & Fantasy" },
    { label: "Gaming & Esports", value: "Gaming & Esports" },
    { label: "Crafts & DIY", value: "Crafts & DIY" },
    { label: "Technology & Gadgets", value: "Technology & Gadgets" },
    { label: "Investing & Trading", value: "Investing & Trading" },
    {
        label: "Human Resources & Recruiting",
        value: "Human Resources & Recruiting",
    },
    { label: "Economics & Policy", value: "Economics & Policy" },
    {
        label: "Public Speaking & Presentation",
        value: "Public Speaking & Presentation",
    },
    { label: "Data Science & Analytics", value: "Data Science & Analytics" },
    {
        label: "Artificial Intelligence & Machine Learning",
        value: "Artificial Intelligence & Machine Learning",
    },
    { label: "Cybersecurity", value: "Cybersecurity" },
    {
        label: "Blockchain & Cryptocurrency",
        value: "Blockchain & Cryptocurrency",
    },
    { label: "Graphic Design", value: "Graphic Design" },
    {
        label: "Animation & Motion Graphics",
        value: "Animation & Motion Graphics",
    },
    { label: "Interior Design", value: "Interior Design" },
    { label: "Fashion & Beauty", value: "Fashion & Beauty" },
    { label: "Entrepreneurship", value: "Entrepreneurship" },
    {
        label: "Customer Service & Support",
        value: "Customer Service & Support",
    },
    { label: "Project Management", value: "Project Management" },
    { label: "Language Learning", value: "Language Learning" },
    { label: "Social Media", value: "Social Media" },
    { label: "Career Development", value: "Career Development" },
    {
        label: "Sustainability & Green Tech",
        value: "Sustainability & Green Tech",
    },
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
