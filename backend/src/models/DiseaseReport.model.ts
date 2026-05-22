import mongoose, { Document, Schema } from 'mongoose';

export interface IDiseaseReport extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  imagePublicId: string;
  cropType: string;
  diagnosis: {
    disease: string;
    diseaseHindi: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'none';
    isHealthy: boolean;
    symptoms: string[];
    causes: string[];
    treatment: string[];
    preventionTips: string[];
    organicRemedies: string[];
  };
  location: {
    state: string;
    district: string;
  };
  aiModel: string;
  createdAt: Date;
}

const diseaseReportSchema = new Schema<IDiseaseReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    cropType: { type: String, required: true, trim: true },
    diagnosis: {
      disease: { type: String, required: true },
      diseaseHindi: { type: String, default: '' },
      confidence: { type: Number, min: 0, max: 100 },
      severity: { type: String, enum: ['low', 'medium', 'high', 'none'], default: 'none' },
      isHealthy: { type: Boolean, default: false },
      symptoms: [String],
      causes: [String],
      treatment: [String],
      preventionTips: [String],
      organicRemedies: [String],
    },
    location: {
      state: { type: String, default: '' },
      district: { type: String, default: '' },
    },
    aiModel: { type: String, default: 'gemini-1.5-flash-vision' },
  },
  { timestamps: true }
);

diseaseReportSchema.index({ userId: 1, createdAt: -1 });
diseaseReportSchema.index({ 'diagnosis.disease': 1, 'location.state': 1 });

export const DiseaseReportModel = mongoose.model<IDiseaseReport>('DiseaseReport', diseaseReportSchema);
