import { Request, Response } from 'express';
import Customer from '../models/Customer';
import Bill from '../models/Bill';
import Payment from '../models/Payment';
import Notification from '../models/Notification';
import { ApiResponse, DashboardStats } from '../types';
import { transformPayments, transformBills, transformNotifications } from '../utils/transformers';
import { 
  CustomerStatus, 
  BillingStatus, 
  PaymentStatus, 
  ConnectionStatus 
} from '../utils/status';

export const getDashboardStats = async (req: Request, res: Response<ApiResponse<DashboardStats>>) => {
  try {
    // Get customer counts
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: CustomerStatus.ACTIVE });
    const suspendedCustomers = await Customer.countDocuments({ status: CustomerStatus.SUSPENDED });
    
    // Get billing counts
    const totalBilled = await Customer.countDocuments({ billingStatus: BillingStatus.BILLED });
    const totalUnbilled = await Customer.countDocuments({ billingStatus: BillingStatus.UNBILLED });
    
    // Get payment counts
    const totalPaid = await Customer.countDocuments({ paymentStatus: PaymentStatus.PAID });
    const totalUnpaid = await Customer.countDocuments({ paymentStatus: PaymentStatus.UNPAID });
    
    // Get connection counts
    const lostConnections = await Customer.countDocuments({ connectionStatus: ConnectionStatus.LOST });
    const underWarning = await Customer.countDocuments({ connectionStatus: ConnectionStatus.UNDER_WARNING });
    
    // Get recent data
    const recentPayments = await Payment.find()
      .sort({ paymentDate: -1 })
      .limit(5);
    
    const recentBills = await Bill.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    const alerts = await Notification.find({ isRead: false })
      .sort({ timestamp: -1 });
    
    const stats: DashboardStats = {
      totalCustomers,
      activeCustomers,
      suspendedCustomers,
      totalBilled,
      totalUnbilled,
      totalPaid,
      totalUnpaid,
      lostConnections,
      underWarning,
      recentPayments: transformPayments(recentPayments as any),
      recentBills: transformBills(recentBills as any),
      alerts: transformNotifications(alerts as any)
    };
    
    res.json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
};
