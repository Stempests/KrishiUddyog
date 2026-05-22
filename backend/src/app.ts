import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import apiRoutes from './routes/index';
import { logger } from './utils/logger';

const app: Application = express();

// ── Security Middleware ─────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));

// ── Request Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }));
}

// ── Rate Limiting ────────────────────────────────────────────
app.use('/api', rateLimiter);

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🌾 KrishiUddyog API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ── 404 Handler ──────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null,
  });
});

// ── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
