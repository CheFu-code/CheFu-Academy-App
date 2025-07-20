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
    - Add CourseBanner Image from ('/Tech-Coding.png','/Science-Engineering.png','/Business-Finance.png','/Health-Fitness.png','/Arts-Creativity.png','/Language-Communication.png','/Personal-Development.png','/History-Culture.png','/Math-Logic.png','/Education-Teaching.png','/Lifestyle-Hobbies.png','/Marketing-Sales.png','/Design-UX.png','/Law-Government.png','/Environment-Sustainability.png','/Photography-Videography.png','/Music-Audio.png','/Food-Cooking.png','/Travel-Adventure.png','/Sports-Recreation.png','/Parenting-Family.png','/Psychology-Mental-Health.png','/Writing-Literature.png','/Religion-Spirituality.png','/Automotive-Vehicles.png','/Real-Estate-Property.png', '/Science-Fiction-Fantasy.png','/Gaming-Esports.png','/Crafts-DIY.png','/Technology-Gadgets.png','/Investing-Trading.png','/Human-Resources-Recruiting.png','/Economics-Policy.png','/Public-Speaking-Presentation.png','/Data-Science-Analytics.png','/Artificial-Intelligence-Machine-Learning.png','/Cybersecurity.png','/Blockchain-Cryptocurrency.png','/Graphic-Design.png','/Animation-Motion-Graphics.png','/Interior-Design.png','/Fashion-Beauty.png','/Entrepreneurship.png','/Customer-Service-Support.png','/Project-Management.png','/Language-Learning.png','/Social-Media.png','/Career-Development.png','/Sustainability-Green-Tech.png'), choose image based on category
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
