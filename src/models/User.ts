import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Permission } from '../types';
import { UserRole, UserStatus, PermissionAction } from '../utils/status';

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: number;
  permissions: Permission[];
  isActive: number;
  lastLogin?: string;
  createdAt: string;
  department?: string;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const PermissionSchema = new Schema<Permission>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  action: {
    type: Number,
    enum: Object.values(PermissionAction),
    required: true
  },
  granted: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: Number,
    enum: Object.values(UserRole),
    default: UserRole.VIEWER
  },
  permissions: [PermissionSchema],
  isActive: {
    type: Number,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE
  },
  lastLogin: {
    type: String
  },
  createdAt: {
    type: String,
    required: true
  },
  department: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes (username and email already have unique indexes from schema definition)
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.model<UserDocument>('User', UserSchema);
