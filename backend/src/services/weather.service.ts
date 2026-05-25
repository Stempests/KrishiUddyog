import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class WeatherService {
  /**
   * Fetches weather data. Uses mock data if API key is not present.
   */
  static async getWeather(lat: number, lon: number) {
    if (!env.WEATHER_API_KEY || env.WEATHER_API_KEY === 'your_openweathermap_api_key' || env.WEATHER_API_KEY.trim() === '') {
      logger.info('Using mock weather data as no valid API key is present.');
      return this.getMockWeatherData(lat, lon);
    }

    try {
      // Assuming user provides OpenWeatherMap API key later
      // Current Weather
      const currentRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${env.WEATHER_API_KEY}&units=metric`);
      // 5 Day / 3 Hour Forecast
      const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${env.WEATHER_API_KEY}&units=metric`);

      return {
        current: currentRes.data,
        forecast: forecastRes.data,
        isMock: false
      };
    } catch (error) {
      logger.error('Error fetching live weather data, falling back to mock.', error);
      return this.getMockWeatherData(lat, lon);
    }
  }

  static getMockWeatherData(lat: number, lon: number) {
    const current = {
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 28.5, feels_like: 30.2, temp_min: 26, temp_max: 31, pressure: 1012, humidity: 65 },
      wind: { speed: 4.5, deg: 180 },
      clouds: { all: 0 },
      sys: { country: 'IN' },
      name: 'Pune',
    };

    // Generate mock forecast for 5 days
    const forecastList = [];
    const now = new Date();
    for (let i = 0; i < 40; i++) {
      const forecastTime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
      forecastList.push({
        dt: Math.floor(forecastTime.getTime() / 1000),
        dt_txt: forecastTime.toISOString().replace('T', ' ').substring(0, 19),
        main: {
          temp: 25 + Math.random() * 10,
          humidity: 50 + Math.random() * 30,
        },
        weather: [{
          main: Math.random() > 0.7 ? 'Rain' : 'Clear',
          description: 'scattered clouds',
          icon: '02d'
        }],
        wind: { speed: 3 + Math.random() * 5 },
        pop: Math.random() // Probability of precipitation
      });
    }

    return {
      current,
      forecast: { list: forecastList },
      isMock: true,
      lat,
      lon
    };
  }
}
