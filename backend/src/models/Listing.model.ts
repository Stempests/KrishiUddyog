import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  sellerId: mongoose.Types.ObjectId;
  cropName: string;
  cropNameHindi: string;
  variety: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton';
  pricePerUnit: number;
  quality: 'A' | 'B' | 'C';
  description: string;
  images: string[];
  location: {
    state: string;
    district: string;
    village?: string;
    coordinates?: [number, number];
  };
  status: 'active' | 'sold' | 'expired' | 'draft';
  harvestDate?: Date;
  expiresAt: Date;
  views: number;
  contactCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true, trim: true },
    cropNameHindi: { type: String, default: '' },
    variety: { type: String, default: 'Common' },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['kg', 'quintal', 'ton'], default: 'quintal' },
    pricePerUnit: { type: Number, required: true, min: 0 },
    quality: { type: String, enum: ['A', 'B', 'C'], default: 'B' },
    description: { type: String, maxlength: 1000 },
    images: [{ type: String }],
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      village: { type: String },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    status: { type: String, enum: ['active', 'sold', 'expired', 'draft'], default: 'active' },
    harvestDate: { type: Date },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    views: { type: Number, default: 0 },
    contactCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

listingSchema.index({ cropName: 1, status: 1, 'location.state': 1 });
listingSchema.index({ sellerId: 1, status: 1 });
listingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
listingSchema.index({ 'location.coordinates': '2dsphere' });

export const ListingModel = mongoose.model<IListing>('Listing', listingSchema);
