import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { logger } from './logger';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export const aiClient = {
  /**
   * Send a text chat message — used by Multilingual Assistant
   */
  chat: async (
    messages: ChatMessage[],
    systemPrompt?: string
  ): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings,
        systemInstruction: systemPrompt,
      });

      const history = messages.slice(0, -1);
      const lastMessage = messages[messages.length - 1];

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      return result.response.text();
    } catch (error) {
      logger.error('AI chat error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  },

  /**
   * Analyze an image — used by Disease Detection
   */
  vision: async (imageBase64: string, prompt: string, mimeType = 'image/jpeg'): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings,
      });

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
      ]);
      return result.response.text();
    } catch (error) {
      logger.error('AI vision error:', error);
      throw new Error('AI vision service temporarily unavailable');
    }
  },

  /**
   * Generate structured JSON from prompt — used by Crop Recommendation
   */
  generateStructured: async <T>(prompt: string): Promise<T> => {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings,
        generationConfig: { responseMimeType: 'application/json' },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as T;
    } catch (error) {
      logger.error('AI structured generation error:', error);
      throw new Error('AI generation service temporarily unavailable');
    }
  },
};
