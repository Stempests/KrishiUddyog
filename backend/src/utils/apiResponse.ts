import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
}

/**
 * Send a standardized success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: Record<string, unknown>
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 */
export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  data: unknown = null
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Wrap async route handlers to catch errors automatically
 */
import { Request, NextFunction, RequestHandler } from 'express';

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
