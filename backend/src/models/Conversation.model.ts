import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  language: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  language: 'hi' | 'en' | 'mr' | 'pa' | 'bn' | 'te' | 'ta';
  messages: IMessage[];
  messageCount: number;
  updatedAt: Date;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  language: { type: String, default: 'hi' },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new Schema<IConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Conversation' },
    language: {
      type: String,
      enum: ['hi', 'en', 'mr', 'pa', 'bn', 'te', 'ta'],
      default: 'hi',
    },
    messages: [messageSchema],
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Keep only last 50 messages to prevent document bloat
conversationSchema.pre('save', function (next) {
  if (this.messages.length > 50) {
    this.messages = this.messages.slice(-50);
  }
  this.messageCount = this.messages.length;
  next();
});

conversationSchema.index({ userId: 1, updatedAt: -1 });

export const ConversationModel = mongoose.model<IConversation>('Conversation', conversationSchema);
