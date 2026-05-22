import { aiClient, ChatMessage } from '../utils/aiClient';
import { ConversationModel } from '../models/Conversation.model';

const LANGUAGE_NAMES: Record<string, string> = {
  hi: 'Hindi', en: 'English', mr: 'Marathi', pa: 'Punjabi',
  bn: 'Bengali', te: 'Telugu', ta: 'Tamil',
};

const SYSTEM_PROMPT = (language: string) => `
You are KrishiMitra (कृषि मित्र), an expert AI agricultural advisor for Indian farmers.

LANGUAGE: Always respond in ${LANGUAGE_NAMES[language] || 'Hindi'} (language code: ${language}).

YOUR EXPERTISE:
- Crop recommendations based on soil, season, and region
- Pest and disease identification and treatment
- Government agricultural schemes (PM-KISAN, Kisan Credit Card, Fasal Bima Yojana)
- Mandi prices and market trends
- Modern farming techniques (drip irrigation, organic farming, precision agriculture)
- Weather impact on farming decisions
- Post-harvest storage and value chain

PERSONALITY:
- Warm, respectful, and patient — like a knowledgeable village elder
- Use simple language farmers can understand
- Provide actionable, practical advice
- When uncertain, recommend consulting a local Krishi Vigyan Kendra (KVK)
- Always keep responses concise (2-4 paragraphs max)
- Use relevant emojis sparingly to make responses friendly 🌱

BOUNDARIES:
- Only answer agriculture, farming, weather, and related topics
- For medical/legal/financial advice beyond farming, politely redirect
`;

export const assistantService = {
  chat: async (
    userId: string,
    message: string,
    language: string,
    conversationId?: string
  ) => {
    let conversation;

    if (conversationId) {
      conversation = await ConversationModel.findOne({ _id: conversationId, userId });
    }

    if (!conversation) {
      // Create new conversation
      const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
      conversation = await ConversationModel.create({
        userId,
        title,
        language,
        messages: [],
      });
    }

    // Build Gemini chat history from stored messages
    const history: ChatMessage[] = conversation.messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add current user message to history
    history.push({ role: 'user', parts: [{ text: message }] });

    // Get AI response
    const response = await aiClient.chat(history, SYSTEM_PROMPT(language));

    // Save both messages
    conversation.messages.push(
      { role: 'user', content: message, language, timestamp: new Date() },
      { role: 'assistant', content: response, language, timestamp: new Date() }
    );
    await conversation.save();

    return {
      conversationId: conversation._id,
      message: response,
      language,
    };
  },

  getConversations: async (userId: string) => {
    return ConversationModel.find({ userId })
      .select('_id title language messageCount updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);
  },

  getConversation: async (userId: string, conversationId: string) => {
    const conversation = await ConversationModel.findOne({ _id: conversationId, userId });
    if (!conversation) throw Object.assign(new Error('Conversation not found'), { statusCode: 404 });
    return conversation;
  },

  deleteConversation: async (userId: string, conversationId: string) => {
    const result = await ConversationModel.findOneAndDelete({ _id: conversationId, userId });
    if (!result) throw Object.assign(new Error('Conversation not found'), { statusCode: 404 });
    return { deleted: true };
  },
};
