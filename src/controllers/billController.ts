import { Request, Response } from 'express';
import Bill from '../models/Bill';
import Customer from '../models/Customer';
import Rate from '../models/Rate';
import { ApiResponse, Bill as BillType } from '../types';
import { AuthRequest } from '../middleware/auth';
import { transformBill, transformBills } from '../utils/transformers';
import { BillStatus } from '../utils/status';
import { getBillAggregationPipeline, convertStringIdToObjectId, addSorting } from '../utils/aggregation';
import { processGlobalFilters, validateFilters, getFilterConfig } from '../utils/globalFilter';

export const getAllBills = async (req: Request, res: Response<ApiResponse<BillType[]>>) => {
  try {
    // Use global filter system
    const filterResult = processGlobalFilters(req, 'bills');
    
    // Validate filters
    const filterConfigs = getFilterConfig('bills');
    const validation = validateFilters(req.query, filterConfigs);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filter parameters',
        error: validation.errors.join(', ')
      });
    }

    // Build aggregation pipeline with filters
    const pipeline = getBillAggregationPipeline(filterResult.query);
    
    // Add sorting
    if (filterResult.sort) {
      pipeline.push({ $sort: filterResult.sort });
    } else {
      addSorting(pipeline, 'createdAt', -1);
    }
    
    // Add pagination
    if (filterResult.skip) {
      pipeline.push({ $skip: filterResult.skip });
    }
    if (filterResult.limit) {
      pipeline.push({ $limit: filterResult.limit });
    }
    
    const bills = await Bill.aggregate(pipeline);
    const transformedBills = transformBills(bills as any);
    
    res.json({
      success: true,
      message: 'Bills fetched successfully',
      data: transformedBills
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills'
    });
  }
};

export const getBillById = async (req: Request, res: Response<ApiResponse<BillType>>) => {
  try {
    const { id } = req.params;
    const pipeline = getBillAggregationPipeline({ id });
    
    const bills = await Bill.aggregate(pipeline);
    
    if (!bills.length) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    const transformedBill = transformBill(bills[0] as any);
    
    res.json({
      success: true,
      message: 'Bill fetched successfully',
      data: transformedBill
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill'
    });
  }
};

export const getBillsByCustomerId = async (req: Request, res: Response<ApiResponse<BillType[]>>) => {
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
    
    const pipeline = getBillAggregationPipeline({ customer_id: customerObjectId });
    addSorting(pipeline, 'createdAt', -1);
    
    const bills = await Bill.aggregate(pipeline);
    const transformedBills = transformBills(bills as any);
    
    res.json({
      success: true,
      message: 'Customer bills fetched successfully',
      data: transformedBills
    });
  } catch (error) {
    console.error('Get customer bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer bills'
    });
  }
};

export const createBill = async (req: AuthRequest, res: Response<ApiResponse<BillType>>) => {
  try {
    const billData = req.body;
    
    // Verify customer exists
    const customer = await Customer.findOne({ id: billData.customerId });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get active rate
    const activeRate = await Rate.findOne({ isActive: true });
    if (!activeRate) {
      return res.status(400).json({
        success: false,
        message: 'No active rate found. Please set an active rate first.'
      });
    }
    
    // Calculate amount using rate_value * usage_kwh
    const amount = billData.usageKwh * activeRate.rateValue;
    
    // Generate unique ID
    const count = await Bill.countDocuments();
    billData.id = `BILL${String(count + 1).padStart(4, '0')}`;
    billData.customer_id = customer._id;
    billData.amount = amount;
    billData.rate_id = activeRate._id;
    billData.watchId = parseInt(customer.watchId.replace('WATCH', ''));
    billData.created_by = req.user?._id;
    
    // Remove old string-based fields
    delete billData.customerId;
    delete billData.customerName;
    delete billData.rateId;
    delete billData.createdBy;
    
    const bill = new Bill(billData);
    await bill.save();
    
    // Update customer billing status
    await Customer.findOneAndUpdate(
      { _id: customer._id },
      { billingStatus: 2 } // BILLED
    );
    
    // Fetch the created bill with populated data
    const pipeline = getBillAggregationPipeline({ _id: bill._id });
    const createdBill = await Bill.aggregate(pipeline);
    
    const transformedBill = transformBill(createdBill[0] as any);
    
    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: transformedBill
    });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bill'
    });
  }
};

export const updateBill = async (req: AuthRequest, res: Response<ApiResponse<BillType>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const bill = await Bill.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    const transformedBill = transformBill(bill as any);
    
    res.json({
      success: true,
      message: 'Bill updated successfully',
      data: transformedBill
    });
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bill'
    });
  }
};
