import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/User.model';

export interface RegisterInput {
  name: string;
  phone: string;
  password: string;
  role?: 'farmer' | 'buyer';
  language?: string;
  state?: string;
  district?: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

const signToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const authService = {
  register: async (input: RegisterInput) => {
    const existingUser = await UserModel.findOne({ phone: input.phone });
    if (existingUser) {
      throw Object.assign(new Error('Phone number already registered'), { statusCode: 409 });
    }

    const user = await UserModel.create({
      name: input.name,
      phone: input.phone,
      passwordHash: input.password, // Pre-save hook hashes this
      role: input.role || 'farmer',
      language: input.language || 'hi',
      location: {
        state: input.state || '',
        district: input.district || '',
      },
    });

    const token = signToken(user._id.toString(), user.role);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        language: user.language,
        location: user.location,
      },
    };
  },

  login: async (input: LoginInput) => {
    const user = await UserModel.findOne({ phone: input.phone }).select('+passwordHash');
    if (!user) {
      throw Object.assign(new Error('Invalid phone number or password'), { statusCode: 401 });
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw Object.assign(new Error('Invalid phone number or password'), { statusCode: 401 });
    }

    const token = signToken(user._id.toString(), user.role);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        language: user.language,
        location: user.location,
      },
    };
  },

  getProfile: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user;
  },

  updateProfile: async (userId: string, updates: Partial<IUser>) => {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user;
  },
};
