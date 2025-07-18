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
    - Add CourseBanner Image from ('/banner1.png','/banner2.png','/banner3.png','/banner4.png','/banner5.png','/banner6.png'), select It randomly
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
