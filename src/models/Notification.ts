import mongoose, { Document, Schema } from 'mongoose';
import { Notification } from '../types';
import { NotificationType, NotificationPriority } from '../utils/status';

export interface NotificationDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  type: number;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  customer_id?: mongoose.Types.ObjectId;
  user_id?: mongoose.Types.ObjectId;
  priority: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<NotificationDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: Number,
    enum: Object.values(NotificationType),
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    index: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  priority: {
    type: Number,
    enum: Object.values(NotificationPriority),
    default: NotificationPriority.MEDIUM
  }
}, {
  timestamps: true
});

// Indexes for better query performance
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ timestamp: -1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ type: 1 });
// customer_id and user_id already have indexes from schema definition

export default mongoose.model<NotificationDocument>('Notification', NotificationSchema);
