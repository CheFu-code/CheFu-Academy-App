import dedent from "dedent";

export default {
    IDEA: dedent`:As you are coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Course title for study (Short)
    - Make sure it is related to description
    - Output will be ARRAY of String in JSON FORMAT only
    - Do not add any plain text in output,
    `,
    // - Chapter Explain in HTML Form, (Code example if required), add line break if required!
    COURSE: dedent`: As you are coaching teacher
    - User want to learn about all topics
    - Create 2 Courses With Course Name, Description, and 5/8 Chapters in each course
    - Make sure to add chapters 
    - List Content in each chapter along with Description in 5 to 8 lines
    - Do not Just Explain what chapter about, Explain in Detail with Example
    - Also Make Easy, Moderate and Advance Course depends on topics
    - Add CourseBanner Image from ('/banner1.png','/banner2.png','/banner3.png','/banner4.png','/banner5.png','/banner6.png'), select image randomly
    - Explain the chapter content as detailed tutorial with list of content
    - Generate 10 Quiz, 10 Flashcard and 10 Questions answer
    - Tag each course to one of the category from :[
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
  "Sustainability & Green Tech"
]

    - Output in JSON Format only 
    -  "courses": [
  {
    "courseTitle": '<Intro to Python>',
    "description": '',
    "banner_image": "/banner1.png",
    "category":"",
    "chapters": [
      {
        chapterName: '',
        content: [
          {
            topic: '<Topic Name in 2 to 4 worlds ex.(Creating Variables)>'
            explain: '< Detailed Explanation in 5 to 8 Lines if required>',
            code: '<Code example of required else null',
            example: '< example of required else null'
          },
          
            ...
          
        ]
      }
    ],
    quiz:[
      {
        question:'',
        options:['a',b,c,d],
        correctAns:''
      }
    ],
    flashcards:[
      {
        front:'',
        back:''
      }
    ],
    qa:[
      {
        question:'',
        answer:''
      }
    ]
  }
]
    `,
};

//  - Add CourseBanner Image from ('/tech_coding.png','/science_engineering.png','/business_finance.png','/health_fitness.png','/arts_creativity.png','/language_communication.png','/personal_development.png','/history_culture.png','/math_logic.png','/education_teaching.png','/lifestyle_hobbies.png','/marketing_sales.png','/design_ux.png','/law_government.png','/environment_sustainability.png','/photography_videography.png','/music_audio.png','/food_cooking.png','/travel_adventure.png','/sports_recreation.png','/parenting_family.png','/psychology_mental_health.png','/writing_literature.png','/religion_spirituality.png','/automotive_vehicles.png','/real_estate_property.png', '/science_fiction_fantasy.png','/gaming_esports.png','/crafts_diy.png','/technology_gadgets.png','/investing_trading.png','/human_resources_recruiting.png','/economics_policy.png','/public_speaking_presentation.png','/data_science_analytics.png','/artificial_intelligence_machine_learning.png','/cybersecurity.png','/blockchain_cryptocurrency.png','/graphic_design.png','/animation_motion_graphics.png','/interior_design.png','/fashion_beauty.png','/entrepreneurship.png','/customer_service_support.png','/project_management.png','/language_learning.png','/social_media.png','/career_development.png','/sustainability_green_tech.png'), choose image based on category
