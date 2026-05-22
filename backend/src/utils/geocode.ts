import axios from 'axios';
import { logger } from './logger';

interface GeocodeResult {
  state: string;
  district: string;
  city?: string;
  pincode?: string;
}

/**
 * Reverse geocode lat/lng to Indian administrative boundaries
 * Uses OpenStreetMap Nominatim (free, no API key required)
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult> => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'KrishiUddyogAI/1.0 (hackathon project)',
      },
      timeout: 5000,
    });

    const addr = response.data.address;
    return {
      state: addr.state || 'Unknown',
      district: addr.county || addr.state_district || addr.district || 'Unknown',
      city: addr.city || addr.town || addr.village,
      pincode: addr.postcode,
    };
  } catch (error) {
    logger.warn('Reverse geocoding failed:', error);
    return { state: 'Unknown', district: 'Unknown' };
  }
};
