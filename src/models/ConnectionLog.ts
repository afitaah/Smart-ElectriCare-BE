import mongoose, { Document, Schema } from 'mongoose';
import { ConnectionLog } from '../types';
import { ConnectionAction } from '../utils/status';

export interface ConnectionLogDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  customer_id: mongoose.Types.ObjectId;
  action: number;
  timestamp: string;
  reason?: string;
  operator_id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ConnectionLogSchema = new Schema<ConnectionLogDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
    index: true
  },
  action: {
    type: Number,
    enum: Object.values(ConnectionAction),
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  operator_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance (customer_id already has index from schema definition)
ConnectionLogSchema.index({ timestamp: -1 });
ConnectionLogSchema.index({ action: 1 });
ConnectionLogSchema.index({ operator_id: 1 });

export default mongoose.model<ConnectionLogDocument>('ConnectionLog', ConnectionLogSchema);
