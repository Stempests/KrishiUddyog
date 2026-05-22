import { Request, Response } from 'express';
import { assistantService } from '../services/assistant.service';
import { sendSuccess, asyncHandler } from '../utils/apiResponse';

export const assistantController = {
  chat: asyncHandler(async (req: Request, res: Response) => {
    const { message, language, conversationId } = req.body;
    const result = await assistantService.chat(
      req.user!._id,
      message,
      language || req.user?.language || 'hi',
      conversationId
    );
    sendSuccess(res, result, 'Message sent');
  }),

  getConversations: asyncHandler(async (req: Request, res: Response) => {
    const result = await assistantService.getConversations(req.user!._id);
    sendSuccess(res, result, 'Conversations fetched');
  }),

  getConversation: asyncHandler(async (req: Request, res: Response) => {
    const result = await assistantService.getConversation(req.user!._id, req.params.id);
    sendSuccess(res, result, 'Conversation fetched');
  }),

  deleteConversation: asyncHandler(async (req: Request, res: Response) => {
    const result = await assistantService.deleteConversation(req.user!._id, req.params.id);
    sendSuccess(res, result, 'Conversation deleted');
  }),
};
