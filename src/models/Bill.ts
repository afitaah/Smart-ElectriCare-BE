import mongoose, { Document, Schema } from 'mongoose';
import { Bill } from '../types';
import { BillStatus } from '../utils/status';

export interface BillDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  customer_id: mongoose.Types.ObjectId;
  amount: number;
  dueDate: string;
  status: number;
  billingPeriod: string;
  usageKwh: number; // Changed from consumption to usageKwh
  rate_id: mongoose.Types.ObjectId; // Foreign key to Rate model
  watchId: number; // Watch ID as per requirements
  createdAt: string;
  paidAt?: string;
  created_by?: mongoose.Types.ObjectId;
  updatedAt?: Date;
}
const BillSchema = new Schema<BillDocument>({
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
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: Object.values(BillStatus),
    default: BillStatus.UNPAID
  },
  billingPeriod: {
    type: String,
    required: true,
    trim: true
  },
  usageKwh: {
    type: Number,
    required: true,
    min: 0
  },
  rate_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Rate'
  },
  watchId: {
    type: Number,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  paidAt: {
    type: String
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance (customer_id already has index from schema definition)
BillSchema.index({ status: 1 });
BillSchema.index({ dueDate: 1 });
BillSchema.index({ billingPeriod: 1 });
BillSchema.index({ createdAt: -1 });

export default mongoose.model<BillDocument>('Bill', BillSchema);
