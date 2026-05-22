import winston from 'winston';

const { combine, timestamp, errors, colorize, simple, json } = winston.format;

const isDev = process.env.NODE_ENV !== 'production';

export const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    isDev ? simple() : json()
  ),
  transports: [
    new winston.transports.Console({
      format: isDev
        ? combine(colorize(), simple())
        : json(),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});
