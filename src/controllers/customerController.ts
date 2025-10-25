import { Request, Response } from 'express';
import Customer from '../models/Customer';
import { CustomerFilter, ApiResponse, Customer as CustomerType } from '../types';
import { AuthRequest } from '../middleware/auth';
import { transformCustomer, transformCustomers } from '../utils/transformers';
import { processGlobalFilters, validateFilters, getFilterConfig } from '../utils/globalFilter';

export const getAllCustomers = async (req: Request, res: Response<ApiResponse<CustomerType[]>>) => {
  try {
    // Use global filter system
    const filterResult = processGlobalFilters(req, 'customers');
    
    // Validate filters
    const filterConfigs = getFilterConfig('customers');
    const validation = validateFilters(req.query, filterConfigs);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filter parameters',
        error: validation.errors.join(', ')
      });
    }

    const customers = await Customer.find(filterResult.query)
      .sort(filterResult.sort)
      .limit(filterResult.limit || 10)
      .skip(filterResult.skip || 0);
    
    const transformedCustomers = transformCustomers(customers as any);
    
    res.json({
      success: true,
      message: 'Customers fetched successfully',
      data: transformedCustomers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    });
  }
};

export const getCustomerById = async (req: Request, res: Response<ApiResponse<CustomerType>>) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ id });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const transformedCustomer = transformCustomer(customer as any);
    
    res.json({
      success: true,
      message: 'Customer fetched successfully',
      data: transformedCustomer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer'
    });
  }
};

export const getFilteredCustomers = async (req: Request, res: Response<ApiResponse<CustomerType[]>>) => {
  try {
    // Use global filter system (same as getAllCustomers)
    const filterResult = processGlobalFilters(req, 'customers');
    
    // Validate filters
    const filterConfigs = getFilterConfig('customers');
    const validation = validateFilters(req.query, filterConfigs);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filter parameters',
        error: validation.errors.join(', ')
      });
    }

    const customers = await Customer.find(filterResult.query)
      .sort(filterResult.sort)
      .limit(filterResult.limit || 10)
      .skip(filterResult.skip || 0);
    
    const transformedCustomers = transformCustomers(customers as any);
    
    res.json({
      success: true,
      message: 'Filtered customers fetched successfully',
      data: transformedCustomers
    });
  } catch (error) {
    console.error('Get filtered customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered customers'
    });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response<ApiResponse<CustomerType>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const customer = await Customer.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const transformedCustomer = transformCustomer(customer as any);
    
    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: transformedCustomer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer'
    });
  }
};

export const createCustomer = async (req: AuthRequest, res: Response<ApiResponse<CustomerType>>) => {
  try {
    const customerData = req.body;
    
    // Generate unique ID
    const count = await Customer.countDocuments();
    customerData.id = `CUST${String(count + 1).padStart(4, '0')}`;
    
    const customer = new Customer(customerData);
    await customer.save();
    
    const transformedCustomer = transformCustomer(customer as any);
    
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: transformedCustomer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer'
    });
  }
};
