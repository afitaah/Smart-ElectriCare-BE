import mongoose, { Document, Schema } from 'mongoose';
import { Payment } from '../types';
import { PaymentMethod, PaymentProcessStatus } from '../utils/status';

export interface PaymentDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  customer_id: mongoose.Types.ObjectId;
  bill_id: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: string;
  paymentMethod: number;
  reference: string;
  status: number;
  processed_by?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new Schema<PaymentDocument>({
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
  bill_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Bill',
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: Number,
    enum: Object.values(PaymentMethod),
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: Number,
    enum: Object.values(PaymentProcessStatus),
    default: PaymentProcessStatus.PENDING
  },
  processed_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance (customer_id, bill_id, and reference already have indexes from schema definition)
PaymentSchema.index({ paymentDate: -1 });
PaymentSchema.index({ status: 1 });

export default mongoose.model<PaymentDocument>('Payment', PaymentSchema);
