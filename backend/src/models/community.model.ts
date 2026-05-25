import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  _id?: string;
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface ICommunityPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  replies: number;
  comments: IComment[];
  isExpert: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const CommunityPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replies: { type: Number, default: 0 },
    comments: [CommentSchema],
    isExpert: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const CommunityPost = mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
