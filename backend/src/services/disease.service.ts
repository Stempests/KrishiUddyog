import { v2 as cloudinary } from 'cloudinary';
import { aiClient } from '../utils/aiClient';
import { preprocessImage } from '../utils/imagePreprocess';
import { DiseaseReportModel } from '../models/DiseaseReport.model';
import { logger } from '../utils/logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface DiseaseDetectionResult {
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
}

export const diseaseService = {
  detect: async (
    userId: string,
    imageBuffer: Buffer,
    cropType: string,
    location: { state: string; district: string }
  ) => {
    // Preprocess image
    const processedImage = await preprocessImage(imageBuffer);

    // Upload to Cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    try {
      const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'krishiuddyog/disease-reports', resource_type: 'image' },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        );
        uploadStream.end(imageBuffer);
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    } catch (error) {
      logger.warn('Cloudinary upload failed, using placeholder');
      imageUrl = 'https://placeholder.com/image';
      imagePublicId = 'local';
    }

    // AI Vision Analysis
    const prompt = `
You are an expert plant pathologist specializing in Indian crops. Analyze this image of a ${cropType} plant.

Return a JSON object with this EXACT structure:
{
  "disease": "Disease name (or 'Healthy Plant' if no disease)",
  "diseaseHindi": "बीमारी का नाम हिंदी में",
  "confidence": 87,
  "severity": "medium",
  "isHealthy": false,
  "symptoms": ["symptom1", "symptom2"],
  "causes": ["cause1", "cause2"],
  "treatment": ["Step 1: ...", "Step 2: ..."],
  "preventionTips": ["tip1", "tip2", "tip3"],
  "organicRemedies": ["remedy1", "remedy2"]
}

severity must be one of: "none", "low", "medium", "high"
If the plant is healthy, set isHealthy to true and severity to "none".
Be specific, practical, and use Indian agricultural context.
`;

    const rawResult = await aiClient.vision(processedImage.base64, prompt, processedImage.mimeType);

    let diagnosis: DiseaseDetectionResult;
    try {
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      diagnosis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        disease: 'Analysis inconclusive',
        diseaseHindi: 'विश्लेषण अनिर्णायक',
        confidence: 0,
        severity: 'none' as const,
        isHealthy: false,
        symptoms: [],
        causes: ['Could not analyze image'],
        treatment: ['Please try with a clearer image'],
        preventionTips: [],
        organicRemedies: [],
      };
    } catch {
      diagnosis = {
        disease: 'Parse Error',
        diseaseHindi: '',
        confidence: 0,
        severity: 'none' as const,
        isHealthy: false,
        symptoms: [],
        causes: [],
        treatment: ['Please try again'],
        preventionTips: [],
        organicRemedies: [],
      };
    }

    const report = await DiseaseReportModel.create({
      userId,
      imageUrl,
      imagePublicId,
      cropType,
      diagnosis,
      location,
      aiModel: 'gemini-1.5-flash-vision',
    });

    return report;
  },

  getReports: async (userId: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      DiseaseReportModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DiseaseReportModel.countDocuments({ userId }),
    ]);
    return { data, total, page, pages: Math.ceil(total / limit) };
  },

  getReportById: async (userId: string, reportId: string) => {
    const report = await DiseaseReportModel.findOne({ _id: reportId, userId });
    if (!report) throw Object.assign(new Error('Report not found'), { statusCode: 404 });
    return report;
  },
};
