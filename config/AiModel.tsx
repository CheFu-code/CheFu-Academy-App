import { chefuApiClient } from '@/services/chefuApiClient';
import { Content } from '@/types/ai';

export const GenerateTopicsAIModel = [
    {
        role: 'user',
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
        role: 'model',
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
        role: 'user',
        parts: [
            {
                text: 'INSERT_INPUT_HERE',
            },
        ],
    },
];

export async function generateTopics(contents: Content[]): Promise<string> {
    return generateWithBackend(contents);
}

export async function generateCourse(contents: Content[]): Promise<string> {
    return generateWithBackend(contents);
}

async function generateWithBackend(contents: Content[]) {
    const response = await chefuApiClient.post('/ai/generate', { contents });
    const result = response.data?.result;

    if (typeof result !== 'string' || !result.trim()) {
        throw new Error('No content returned from AI service.');
    }

    return extractJsonFromText(result);
}

function extractJsonFromText(text: string): string {
    if (!text) return '';
    return text.replace(/^```json[\r\n]+|```$/gi, '').trim();
}
