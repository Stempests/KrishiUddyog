import mongoose, { Document, Schema } from 'mongoose';

export interface ICropRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  input: {
    soilType: string;
    state: string;
    district: string;
    season: 'kharif' | 'rabi' | 'zaid';
    rainfall: number;
    temperature: number;
    budget: number;
    irrigationType: string;
    previousCrop?: string;
  };
  recommendations: Array<{
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
  }>;
  aiModel: string;
  createdAt: Date;
}

const cropRecommendationSchema = new Schema<ICropRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    input: {
      soilType: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      season: { type: String, enum: ['kharif', 'rabi', 'zaid'], required: true },
      rainfall: { type: Number, required: true },
      temperature: { type: Number, required: true },
      budget: { type: Number, required: true },
      irrigationType: { type: String, required: true },
      previousCrop: { type: String },
    },
    recommendations: [
      {
        crop: { type: String, required: true },
        cropHindi: { type: String, default: '' },
        confidence: { type: Number, min: 0, max: 100 },
        expectedYield: { type: String },
        marketPrice: { type: Number },
        profitEstimate: { type: Number },
        waterRequirement: { type: String },
        growthDuration: { type: String },
        tips: [String],
        risks: [String],
      },
    ],
    aiModel: { type: String, default: 'gemini-1.5-flash' },
  },
  { timestamps: true }
);

cropRecommendationSchema.index({ userId: 1, createdAt: -1 });

export const CropModel = mongoose.model<ICropRecommendation>('CropRecommendation', cropRecommendationSchema);
