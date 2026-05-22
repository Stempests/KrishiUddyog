import mongoose, { Document, Schema } from 'mongoose';

export interface IMandiPrice extends Document {
  commodity: string;
  commodityHindi: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalDate: Date;
  fetchedAt: Date;
}

const mandiPriceSchema = new Schema<IMandiPrice>({
  commodity: { type: String, required: true, trim: true },
  commodityHindi: { type: String, default: '' },
  variety: { type: String, default: 'Common' },
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  market: { type: String, required: true, trim: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  arrivalDate: { type: Date, required: true },
  fetchedAt: { type: Date, default: Date.now },
});

// TTL index: auto-expire cached prices after 6 hours
mandiPriceSchema.index({ fetchedAt: 1 }, { expireAfterSeconds: 21600 });

// Query indexes
mandiPriceSchema.index({ commodity: 1, state: 1, arrivalDate: -1 });
mandiPriceSchema.index({ state: 1, district: 1 });

export const MandiPriceModel = mongoose.model<IMandiPrice>('MandiPrice', mandiPriceSchema);
