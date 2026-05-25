import mongoose, { Document, Schema } from 'mongoose';

export interface ITransportRoute extends Document {
  userId: mongoose.Types.ObjectId;
  pickupLocation: string;
  dropoffLocation: string;
  date: Date;
  weight: string; // e.g. "2 Tons"
  route: string; // Auto-generated "Pickup to Dropoff"
  status: 'active' | 'booked' | 'completed';
  driverName?: string;
  rating?: string;
  price?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transportRouteSchema = new Schema<ITransportRoute>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pickupLocation: { type: String, required: true, trim: true },
    dropoffLocation: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    weight: { type: String, required: true },
    route: { type: String }, // Pre-save hook will populate this
    status: { type: String, enum: ['active', 'booked', 'completed'], default: 'active' },
    driverName: { type: String, default: 'Unassigned' },
    rating: { type: String, default: '4.5' }, // Mock rating for now
    price: { type: String, default: 'Negotiable' },
  },
  { timestamps: true }
);

transportRouteSchema.pre('save', function (next) {
  if (this.pickupLocation && this.dropoffLocation) {
    // Keep it clean like "Pune to Mumbai"
    const p = this.pickupLocation.split(',')[0];
    const d = this.dropoffLocation.split(',')[0];
    this.route = `${p} to ${d}`;
  }
  next();
});

export const TransportRouteModel = mongoose.model<ITransportRoute>('TransportRoute', transportRouteSchema);
