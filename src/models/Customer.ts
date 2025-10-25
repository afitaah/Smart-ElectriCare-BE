import mongoose, { Document, Schema } from 'mongoose';
import { Customer } from '../types';
import { 
  CustomerStatus, 
  ConnectionStatus, 
  BillingStatus, 
  PaymentStatus, 
  PrimarySecondaryStatus 
} from '../utils/status';

export interface CustomerDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
  phone: string;
  watchId: string;
  status: number;
  prStatus: number;
  scStatus: number;
  billingStatus: number;
  paymentStatus: number;
  connectionStatus: number;
  address: string;
  email?: string;
  registrationDate: string;
  lastPaymentDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerSchema = new Schema<CustomerDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  watchId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: Number,
    enum: Object.values(CustomerStatus),
    default: CustomerStatus.PENDING
  },
  prStatus: {
    type: Number,
    enum: Object.values(PrimarySecondaryStatus),
    default: PrimarySecondaryStatus.INACTIVE
  },
  scStatus: {
    type: Number,
    enum: Object.values(PrimarySecondaryStatus),
    default: PrimarySecondaryStatus.INACTIVE
  },
  billingStatus: {
    type: Number,
    enum: Object.values(BillingStatus),
    default: BillingStatus.UNBILLED
  },
  paymentStatus: {
    type: Number,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.UNPAID
  },
  connectionStatus: {
    type: Number,
    enum: Object.values(ConnectionStatus),
    default: ConnectionStatus.LOST
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  registrationDate: {
    type: String,
    required: true
  },
  lastPaymentDate: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
CustomerSchema.index({ name: 'text', phone: 'text', watchId: 'text', email: 'text' });
CustomerSchema.index({ status: 1 });
CustomerSchema.index({ billingStatus: 1 });
CustomerSchema.index({ paymentStatus: 1 });
CustomerSchema.index({ connectionStatus: 1 });

export default mongoose.model<CustomerDocument>('Customer', CustomerSchema);
