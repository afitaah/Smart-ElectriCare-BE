import mongoose, { Document, Schema } from 'mongoose';
import { ActivityLog } from '../types';

export interface ActivityLogDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  user_id: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ActivityLogSchema = new Schema<ActivityLogDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  details: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance (user_id already has index from schema definition)
ActivityLogSchema.index({ timestamp: -1 });
ActivityLogSchema.index({ action: 1 });
ActivityLogSchema.index({ resource: 1 });

export default mongoose.model<ActivityLogDocument>('ActivityLog', ActivityLogSchema);
