import { aiClient } from '../utils/aiClient';
import { CropModel } from '../models/Crop.model';

export interface CropRecommendInput {
  soilType: string;
  state: string;
  district: string;
  season: 'kharif' | 'rabi' | 'zaid';
  rainfall: number;
  temperature: number;
  budget: number;
  irrigationType: string;
  previousCrop?: string;
  landSize?: number;
}

interface CropRecommendation {
  crop: string;
  cropHindi: string;
  confidence: number;
  expectedYield: string;
  marketPrice: number;
  profitEstimate: number;
  waterRequirement: string;
  growthDuration: string;
  tips: string[];
  risks: string[];
}

export const cropService = {
  recommend: async (userId: string, input: CropRecommendInput) => {
    const prompt = `
You are an expert Indian agricultural advisor. Based on the following farm conditions, recommend the top 3 most suitable crops.

Farm Conditions:
- Soil Type: ${input.soilType}
- State: ${input.state}, District: ${input.district}
- Season: ${input.season} (${input.season === 'kharif' ? 'June-November' : input.season === 'rabi' ? 'November-April' : 'March-June'})
- Average Rainfall: ${input.rainfall} mm
- Temperature: ${input.temperature}°C
- Budget: ₹${input.budget} per acre
- Irrigation: ${input.irrigationType}
${input.previousCrop ? `- Previous Crop: ${input.previousCrop}` : ''}
${input.landSize ? `- Land Size: ${input.landSize} acres` : ''}

Return a JSON object with this exact structure:
{
  "recommendations": [
    {
      "crop": "English crop name",
      "cropHindi": "हिंदी नाम",
      "confidence": 92,
      "expectedYield": "25-30 quintals/acre",
      "marketPrice": 2100,
      "profitEstimate": 45000,
      "waterRequirement": "Moderate (500-700mm)",
      "growthDuration": "120-130 days",
      "tips": ["tip1", "tip2", "tip3"],
      "risks": ["risk1", "risk2"]
    }
  ]
}

marketPrice should be in INR per quintal. profitEstimate should be in INR per acre. Be specific to ${input.state} market conditions.
`;

    const result = await aiClient.generateStructured<{ recommendations: CropRecommendation[] }>(prompt);

    // Save to DB
    const saved = await CropModel.create({
      userId,
      input,
      recommendations: result.recommendations,
      aiModel: 'gemini-1.5-flash',
    });

    return saved;
  },

  getHistory: async (userId: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      CropModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CropModel.countDocuments({ userId }),
    ]);
    return { data, total, page, pages: Math.ceil(total / limit) };
  },

  getSeasonalCalendar: (state: string) => {
    const calendar: Record<string, { kharif: string[]; rabi: string[]; zaid: string[] }> = {
      Punjab: { kharif: ['Rice', 'Maize', 'Cotton', 'Sugarcane'], rabi: ['Wheat', 'Mustard', 'Gram', 'Barley'], zaid: ['Watermelon', 'Muskmelon', 'Cucumber'] },
      Maharashtra: { kharif: ['Soybean', 'Cotton', 'Jowar', 'Bajra'], rabi: ['Wheat', 'Gram', 'Sunflower'], zaid: ['Groundnut', 'Vegetables'] },
      'Uttar Pradesh': { kharif: ['Rice', 'Sugarcane', 'Maize', 'Arhar'], rabi: ['Wheat', 'Mustard', 'Pea', 'Lentil'], zaid: ['Maize', 'Groundnut', 'Vegetables'] },
      Karnataka: { kharif: ['Rice', 'Jowar', 'Bajra', 'Groundnut'], rabi: ['Wheat', 'Gram', 'Sunflower', 'Safflower'], zaid: ['Vegetables', 'Watermelon'] },
    };
    return calendar[state] || {
      kharif: ['Rice', 'Maize', 'Cotton', 'Soybean', 'Groundnut', 'Jowar', 'Bajra'],
      rabi: ['Wheat', 'Mustard', 'Gram', 'Peas', 'Lentil', 'Barley'],
      zaid: ['Watermelon', 'Muskmelon', 'Cucumber', 'Vegetables'],
    };
  },
};
