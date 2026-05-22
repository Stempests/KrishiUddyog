import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError, asyncHandler } from '../utils/apiResponse';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['farmer', 'buyer']).optional(),
  language: z.enum(['hi', 'en', 'mr', 'pa', 'bn', 'te', 'ta']).optional(),
  state: z.string().optional(),
  district: z.string().optional(),
});

export const loginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  password: z.string().min(1, 'Password is required'),
});

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration successful! Welcome to KrishiUddyog AI 🌾', 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getProfile(req.user!._id);
    sendSuccess(res, user, 'Profile fetched');
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user!._id, req.body);
    sendSuccess(res, user, 'Profile updated successfully');
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, null, 'Logged out successfully');
  }),
};
