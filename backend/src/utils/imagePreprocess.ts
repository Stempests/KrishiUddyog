import sharp from 'sharp';
import { logger } from './logger';

export interface ProcessedImage {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
  sizeKB: number;
}

/**
 * Resize and optimize image before sending to AI Vision API
 * Target: max 1024x1024, JPEG, quality 85
 */
export const preprocessImage = async (
  inputBuffer: Buffer,
  maxWidth = 1024,
  maxHeight = 1024
): Promise<ProcessedImage> => {
  try {
    const processed = await sharp(inputBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    const metadata = await sharp(processed).metadata();

    return {
      base64: processed.toString('base64'),
      mimeType: 'image/jpeg',
      width: metadata.width || 0,
      height: metadata.height || 0,
      sizeKB: Math.round(processed.length / 1024),
    };
  } catch (error) {
    logger.error('Image preprocessing failed:', error);
    throw new Error('Failed to process image');
  }
};
