// Customer Types
export interface Customer {
  _id?: string;
  id: string;
  name: string;
  phone: string;
  watchId: string;
  status: number; // CustomerStatus enum
  prStatus: number; // PrimarySecondaryStatus enum
  scStatus: number; // PrimarySecondaryStatus enum
  billingStatus: number; // BillingStatus enum
  paymentStatus: number; // PaymentStatus enum
  connectionStatus: number; // ConnectionStatus enum
  address: string;
  email?: string;
  registrationDate: string;
  lastPaymentDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Rate Types
export interface Rate {
  _id?: string;
  id: string;
  rateValue: number;
  description?: string;
  isActive: boolean;
  effectiveDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Bill Types
export interface Bill {
  _id?: string;
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: number; // BillStatus enum
  billingPeriod: string;
  usageKwh: number; // Changed from consumption to usageKwh
  rateId: string; // Foreign key to Rate model
  watchId: number; // Watch ID as per requirements
  createdAt: string;
  paidAt?: string;
  createdBy?: string;
  updatedAt?: Date;
}

// Payment Types
export interface Payment {
  _id?: string;
  id: string;
  customerId: string;
  customerName: string;
  billId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: number; // PaymentMethod enum
  reference: string;
  status: number; // PaymentProcessStatus enum
  processedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Types
export interface User {
  _id?: string;
  id: string;
  username: string;
  email: string;
  password?: string;
  role: number; // UserRole enum
  permissions: Permission[];
  isActive: number; // UserStatus enum
  lastLogin?: string;
  createdAt: string;
  department?: string;
  updatedAt?: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: number; // PermissionAction enum
  granted: boolean;
}

// Notification Types
export interface Notification {
  _id?: string;
  id: string;
  type: number; // NotificationType enum
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  customerId?: string;
  userId?: string;
  priority: number; // NotificationPriority enum
  createdAt?: Date;
  updatedAt?: Date;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  totalBilled: number;
  totalUnbilled: number;
  totalPaid: number;
  totalUnpaid: number;
  lostConnections: number;
  underWarning: number;
  recentPayments: Payment[];
  recentBills: Bill[];
  alerts: Notification[];
}

// Filter Types
export interface CustomerFilter {
  status?: string;
  billingStatus?: string;
  paymentStatus?: string;
  connectionStatus?: string;
  search?: string;
}

export interface UserFilter {
  role?: string;
  isActive?: boolean;
  search?: string;
}

// Connection Log Types
export interface ConnectionLog {
  _id?: string;
  id: string;
  customerId: string;
  action: number; // ConnectionAction enum
  timestamp: string;
  reason?: string;
  operatorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Activity Log Types
export interface ActivityLog {
  _id?: string;
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password'>;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}