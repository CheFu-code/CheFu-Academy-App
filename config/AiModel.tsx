import { chefuApiClient } from '@/services/chefuApiClient';
import { Content } from '@/types/ai';

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
    return text
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();
}
