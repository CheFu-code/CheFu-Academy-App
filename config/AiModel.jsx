// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
});
const config = {
    responseMimeType: "application/json",
};
const model = "gemini-2.0-flash";
export const GenerateTopicsAIModel = [
    {
        role: "user",
        parts: [
            {
                text: `Learn Python: As you are coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Course title for study (Short)
    - Make sure it is related to description
    - Output will be ARRAY of String in JSON FORMAT only
    - Do not add any plain text in output,
    `,
            },
        ],
    },
    {
        role: "model",
        parts: [
            {
                text: `\`\`\`json
[
  "Python Basics: A Gentle Introduction",
  "Data Structures & Algorithms in Python",
  "Object-Oriented Programming with Python",
  "Web Development with Python & Flask",
  "Data Science with Python: NumPy & Pandas",
  "Machine Learning with Python: scikit-learn",
  "Automating Tasks with Python"
]
\`\`\``,
            },
        ],
    },
    {
        role: "user",
        parts: [
            {
                text: `INSERT_INPUT_HERE`,
            },
        ],
    },
];

// Utility function to generate topics using Google GenAI
export async function generateTopics(contents) {
    try {
        // Only log when function is called and on error
        // console.log('[AIModel] generateTopics called');
        if (!ai || !ai.models || !ai.models.generateContent) {
            throw new Error(
                "GoogleGenAI SDK is not initialized or generateContent is missing"
            );
        }
        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });
        if (
            !response ||
            !response.candidates ||
            !response.candidates[0] ||
            !response.candidates[0].content
        ) {
            throw new Error("No candidates/content in Gemini response");
        }
        // Extract the text from the first candidate
        const text = response.candidates[0].content.parts[0]?.text || "";
        return extractJsonFromText(text);
    } catch (error) {
        console.error("[AIModel ERROR] Error generating topics:", error);
        throw error;
    }
}

// Utility to clean AI response and extract JSON
function extractJsonFromText(text) {
    if (!text) return "";
    // Remove code block markers and trim whitespace
    return text.replace(/^```json[\r\n]+|```$/gi, "").trim();
}

// Utility function to generate courses using Google GenAI
export async function generateCourse(contents) {
    try {
        if (!ai || !ai.models || !ai.models.generateContent) {
            throw new Error(
                "GoogleGenAI SDK is not initialized or generateContent is missing"
            );
        }
        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });
        if (
            !response ||
            !response.candidates ||
            !response.candidates[0] ||
            !response.candidates[0].content
        ) {
            throw new Error("No candidates/content in Gemini response");
        }
        // Extract the text from the first candidate
        const text = response.candidates[0].content.parts[0]?.text || "";
        return extractJsonFromText(text);
    } catch (error) {
        console.error("[AIModel ERROR] Error generating courses:", error);
        throw error;
    }
}
