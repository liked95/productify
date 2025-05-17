import { GoogleGenAI } from '@google/genai';

// Initialize the Google AI SDK
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Get the model
export const model = ai.models.generateContent;
