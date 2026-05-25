import axios from 'axios';
import { MandiPriceModel } from '../models/MandiPrice.model';
import { logger } from '../utils/logger';

// Commodity Hindi name mapping
const COMMODITY_HINDI: Record<string, string> = {
  Wheat: 'गेहूँ', Rice: 'चावल', Maize: 'मक्का', Cotton: 'कपास',
  Soybean: 'सोयाबीन', Mustard: 'सरसों', Gram: 'चना', Sugarcane: 'गन्ना',
  Onion: 'प्याज', Potato: 'आलू', Tomato: 'टमाटर', Turmeric: 'हल्दी',
};

// Robust helper to parse various Indian date formats (e.g. DD/MM/YYYY) returned by Agmarknet API
function parseArrivalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  const cleanStr = dateStr.trim();
  
  // Format: DD/MM/YYYY
  if (cleanStr.includes('/')) {
    const parts = cleanStr.split('/');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY/MM/DD
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
      } else {
        // DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
  }

  // Format: DD-MM-YYYY or YYYY-MM-DD
  if (cleanStr.includes('-')) {
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        return new Date(cleanStr);
      } else {
        // DD-MM-YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
  }

  const parsed = new Date(cleanStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export const mandiService = {
  getPrices: async (params: { commodity?: string; state?: string; district?: string }) => {
    const query: Record<string, string | RegExp> = {};
    if (params.commodity) query.commodity = new RegExp(params.commodity, 'i');
    if (params.state) query.state = new RegExp(params.state, 'i');
    if (params.district) query.district = new RegExp(params.district, 'i');

    // Try cache first
    const cached = await MandiPriceModel.find(query)
      .sort({ arrivalDate: -1 })
      .limit(50);

    if (cached.length > 0) {
      return { data: cached, source: 'cache' };
    }

    // Fetch from data.gov.in API
    const fresh = await mandiService.fetchFromGovAPI(params);
    return { data: fresh, source: 'api' };
  },

  fetchFromGovAPI: async (params: { commodity?: string; state?: string }) => {
    try {
      const API_KEY = process.env.AGMARKNET_API_KEY;
      if (!API_KEY) {
        logger.warn('AGMARKNET_API_KEY not set, returning mock data');
        return mandiService.getMockPrices(params.state || 'Punjab', params.commodity || 'Wheat');
      }

      const response = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070', {
        params: {
          'api-key': API_KEY,
          format: 'json',
          limit: 50,
          ...(params.commodity && { 'filters[commodity]': params.commodity }),
          ...(params.state && { 'filters[state]': params.state }),
        },
        timeout: 10000,
      });

      const records = response.data.records || [];
      if (records.length === 0) {
        logger.warn('Mandi API returned 0 records, falling back to mock prices');
        return mandiService.getMockPrices(params.state || 'Bihar', params.commodity || 'Wheat');
      }

      const prices = records.map((r: Record<string, string>) => ({
        commodity: r.commodity,
        commodityHindi: COMMODITY_HINDI[r.commodity] || '',
        variety: r.variety || 'Common',
        state: r.state,
        district: r.district,
        market: r.market,
        minPrice: parseFloat(r.min_price) || 0,
        maxPrice: parseFloat(r.max_price) || 0,
        modalPrice: parseFloat(r.modal_price) || 0,
        unit: 'Quintal',
        arrivalDate: parseArrivalDate(r.arrival_date),
        fetchedAt: new Date(),
      }));

      // Cache to MongoDB
      if (prices.length > 0) {
        await MandiPriceModel.insertMany(prices, { ordered: false }).catch(() => {});
      }

      return prices;
    } catch (error) {
      logger.error('Mandi API fetch error:', error);
      return mandiService.getMockPrices(params.state || 'Punjab', params.commodity || 'Wheat');
    }
  },

  getMockPrices: (state: string, commodity: string) => {
    const mockData = [
      { commodity, commodityHindi: COMMODITY_HINDI[commodity] || '', variety: 'Common', state, district: 'District 1', market: 'Main Market', minPrice: 1800, maxPrice: 2200, modalPrice: 2000, unit: 'Quintal', arrivalDate: new Date(), fetchedAt: new Date() },
      { commodity, commodityHindi: COMMODITY_HINDI[commodity] || '', variety: 'Grade A', state, district: 'District 2', market: 'APMC Market', minPrice: 1900, maxPrice: 2300, modalPrice: 2100, unit: 'Quintal', arrivalDate: new Date(), fetchedAt: new Date() },
    ];
    return mockData;
  },

  getTrending: async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return MandiPriceModel.aggregate([
      { $match: { arrivalDate: { $gte: yesterday } } },
      { $group: { _id: '$commodity', avgModal: { $avg: '$modalPrice' }, count: { $sum: 1 }, commodityHindi: { $first: '$commodityHindi' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
  },

  getCommodities: () => Object.keys(COMMODITY_HINDI),
};
