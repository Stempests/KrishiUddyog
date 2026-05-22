import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  passwordHash: string;
  role: 'farmer' | 'buyer' | 'admin';
  language: 'hi' | 'en' | 'mr' | 'pa' | 'bn' | 'te' | 'ta';
  location: {
    state: string;
    district: string;
    coordinates?: [number, number];
  };
  landSize?: number;
  crops: string[];
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'admin'],
      default: 'farmer',
    },
    language: {
      type: String,
      enum: ['hi', 'en', 'mr', 'pa', 'bn', 'te', 'ta'],
      default: 'hi',
    },
    location: {
      state: { type: String, default: '' },
      district: { type: String, default: '' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    landSize: { type: Number, min: 0 },
    crops: [{ type: String, trim: true }],
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret['passwordHash'];
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

export const UserModel = mongoose.model<IUser>('User', userSchema);
