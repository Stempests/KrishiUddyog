import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/apiResponse';
import { UserModel } from '../models/User.model';

export interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: string;
        name: string;
        language: string;
      };
    }
  }
}

/**
 * Protect routes — requires valid JWT in Authorization header
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required. Please log in.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await UserModel.findById(decoded.userId).select('_id role name language');
    if (!user) {
      sendError(res, 'User no longer exists', 401);
      return;
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      language: user.language,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 'Session expired. Please log in again.', 401);
    } else {
      sendError(res, 'Invalid authentication token', 401);
    }
  }
};

/**
 * Restrict access to specific roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'You do not have permission to perform this action', 403);
      return;
    }
    next();
  };
};
