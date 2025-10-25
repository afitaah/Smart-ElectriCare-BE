import mongoose, { Document, Schema } from 'mongoose';

export interface RateDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  rateValue: number;
  description?: string;
  isActive: boolean;
  effectiveDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RateSchema = new Schema<RateDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  rateValue: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  effectiveDate: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
RateSchema.index({ isActive: 1 });
RateSchema.index({ effectiveDate: 1 });

export default mongoose.model<RateDocument>('Rate', RateSchema);
