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

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration successful! Welcome to AgriConnect India 🌾', 201);
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
    const updates = { ...req.body };
    
    // Check if an image was uploaded
    if (req.file) {
      if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key') {
        try {
          const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'agriconnect/avatars' },
              (err, res) => { if (err || !res) reject(err); else resolve(res as { secure_url: string }); }
            );
            stream.end(req.file!.buffer);
          });
          updates.avatar = result.secure_url;
        } catch (e) {
          return sendError(res, 'Failed to upload profile picture', 500);
        }
      } else {
        // Fallback to base64 Data URL if Cloudinary is not set up
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        updates.avatar = `data:${mimeType};base64,${base64Image}`;
      }
    }

    const user = await authService.updateProfile(req.user!._id, updates);
    sendSuccess(res, user, 'Profile updated successfully');
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, null, 'Logged out successfully');
  }),
};
