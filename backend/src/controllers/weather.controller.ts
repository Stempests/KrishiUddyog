import { Request, Response } from 'express';
import { WeatherService } from '../services/weather.service';
import { logger } from '../utils/logger';

export const getWeather = async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 18.5204; // Default Pune lat
    const lon = parseFloat(req.query.lon as string) || 73.8567; // Default Pune lon

    const weatherData = await WeatherService.getWeather(lat, lon);
    
    res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    logger.error('Weather Controller Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch weather data' });
  }
};
