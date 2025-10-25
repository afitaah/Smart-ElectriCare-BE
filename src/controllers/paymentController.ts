import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Bill from '../models/Bill';
import Customer from '../models/Customer';
import { ApiResponse, Payment as PaymentType } from '../types';
import { AuthRequest } from '../middleware/auth';
import { transformPayment, transformPayments } from '../utils/transformers';
import { PaymentProcessStatus } from '../utils/status';
import { getPaymentAggregationPipeline, convertStringIdToObjectId, addSorting } from '../utils/aggregation';

export const getAllPayments = async (req: Request, res: Response<ApiResponse<PaymentType[]>>) => {
  try {
    const pipeline = getPaymentAggregationPipeline();
    addSorting(pipeline, 'paymentDate', -1);
    
    const payments = await Payment.aggregate(pipeline);
    const transformedPayments = transformPayments(payments as any);
    
    res.json({
      success: true,
      message: 'Payments fetched successfully',
      data: transformedPayments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
};

export const getPaymentById = async (req: Request, res: Response<ApiResponse<PaymentType>>) => {
  try {
    const { id } = req.params;
    const pipeline = getPaymentAggregationPipeline({ id });
    
    const payments = await Payment.aggregate(pipeline);
    
    if (!payments.length) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const transformedPayment = transformPayment(payments[0] as any);
    
    res.json({
      success: true,
      message: 'Payment fetched successfully',
      data: transformedPayment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment'
    });
  }
};

export const getPaymentsByCustomerId = async (req: Request, res: Response<ApiResponse<PaymentType[]>>) => {
  try {
    const { customerId } = req.params;
    
    // Convert string ID to ObjectId
    const customerObjectId = await convertStringIdToObjectId(Customer, customerId);
    if (!customerObjectId) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const pipeline = getPaymentAggregationPipeline({ customer_id: customerObjectId });
    addSorting(pipeline, 'paymentDate', -1);
    
    const payments = await Payment.aggregate(pipeline);
    const transformedPayments = transformPayments(payments as any);
    
    res.json({
      success: true,
      message: 'Customer payments fetched successfully',
      data: transformedPayments
    });
  } catch (error) {
    console.error('Get customer payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer payments'
    });
  }
};

export const createPayment = async (req: AuthRequest, res: Response<ApiResponse<PaymentType>>) => {
  try {
    const paymentData = req.body;
    
    // Verify customer and bill exist
    const customer = await Customer.findOne({ id: paymentData.customerId });
    const bill = await Bill.findOne({ id: paymentData.billId });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    // Generate unique ID and reference
    const count = await Payment.countDocuments();
    paymentData.id = `PAY${String(count + 1).padStart(4, '0')}`;
    paymentData.customer_id = customer._id;
    paymentData.bill_id = bill._id;
    paymentData.reference = `TXN${String(count + 1).padStart(6, '0')}`;
    paymentData.processed_by = req.user?._id;
    paymentData.status = PaymentProcessStatus.COMPLETED;
    
    // Remove old string-based fields
    delete paymentData.customerId;
    delete paymentData.billId;
    delete paymentData.customerName;
    delete paymentData.processedBy;
    
    const payment = new Payment(paymentData);
    await payment.save();
    
    // Update bill status
    await Bill.findOneAndUpdate(
      { _id: bill._id },
      { 
        status: 2, // PAID
        paidAt: paymentData.paymentDate
      }
    );
    
    // Update customer payment status
    await Customer.findOneAndUpdate(
      { _id: customer._id },
      { 
        paymentStatus: 2, // PAID
        lastPaymentDate: paymentData.paymentDate
      }
    );
    
    // Fetch the created payment with populated data
    const pipeline = getPaymentAggregationPipeline({ _id: payment._id });
    const createdPayment = await Payment.aggregate(pipeline);
    
    const transformedPayment = transformPayment(createdPayment[0] as any);
    
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: transformedPayment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment'
    });
  }
};
