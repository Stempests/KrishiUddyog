import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/apiResponse';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 min
const max = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

export const rateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'Too many requests. Please try again later.', 429);
  },
});

/** Stricter limiter for auth routes */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (_req, res) => {
    sendError(res, 'Too many login attempts. Please try again in 15 minutes.', 429);
  },
});

/** Strict limiter for AI endpoints */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  handler: (_req, res) => {
    sendError(res, 'AI request limit exceeded. Please wait a moment.', 429);
  },
});
