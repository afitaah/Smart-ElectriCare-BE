import { Request, Response } from 'express';
import Rate from '../models/Rate';
import { ApiResponse, Rate as RateType } from '../types';
import { AuthRequest } from '../middleware/auth';
import { transformRate } from '../utils/transformers';

export const getAllRates = async (req: Request, res: Response<ApiResponse<RateType[]>>) => {
  try {
    const rates = await Rate.find().sort({ effectiveDate: -1 });
    const transformedRates = transformRates(rates as any);
    
    res.json({
      success: true,
      message: 'Rates fetched successfully',
      data: transformedRates
    });
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rates'
    });
  }
};

export const getActiveRate = async (req: Request, res: Response<ApiResponse<RateType>>) => {
  try {
    const activeRate = await Rate.findOne({ isActive: true }).sort({ effectiveDate: -1 });
    
    if (!activeRate) {
      return res.status(404).json({
        success: false,
        message: 'No active rate found'
      });
    }
    
    const transformedRate = transformRate(activeRate as any);
    
    res.json({
      success: true,
      message: 'Active rate fetched successfully',
      data: transformedRate
    });
  } catch (error) {
    console.error('Get active rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active rate'
    });
  }
};

export const getRateById = async (req: Request, res: Response<ApiResponse<RateType>>) => {
  try {
    const { id } = req.params;
    const rate = await Rate.findOne({ id });
    
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Rate not found'
      });
    }
    
    const transformedRate = transformRate(rate as any);
    
    res.json({
      success: true,
      message: 'Rate fetched successfully',
      data: transformedRate
    });
  } catch (error) {
    console.error('Get rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rate'
    });
  }
};

export const createRate = async (req: AuthRequest, res: Response<ApiResponse<RateType>>) => {
  try {
    const rateData = req.body;
    
    // Generate unique ID
    const count = await Rate.countDocuments();
    rateData.id = `RATE${String(count + 1).padStart(4, '0')}`;
    
    // If this is set as active, deactivate all other rates
    if (rateData.isActive) {
      await Rate.updateMany({}, { isActive: false });
    }
    
    const rate = new Rate(rateData);
    await rate.save();
    
    const transformedRate = transformRate(rate as any);
    
    res.status(201).json({
      success: true,
      message: 'Rate created successfully',
      data: transformedRate
    });
  } catch (error) {
    console.error('Create rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create rate'
    });
  }
};

export const updateRate = async (req: AuthRequest, res: Response<ApiResponse<RateType>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If this is set as active, deactivate all other rates
    if (updates.isActive) {
      await Rate.updateMany({}, { isActive: false });
    }

    const rate = await Rate.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Rate not found'
      });
    }
    
    const transformedRate = transformRate(rate as any);
    
    res.json({
      success: true,
      message: 'Rate updated successfully',
      data: transformedRate
    });
  } catch (error) {
    console.error('Update rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rate'
    });
  }
};

export const deleteRate = async (req: AuthRequest, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;
    
    const rate = await Rate.findOne({ id });
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Rate not found'
      });
    }

    // Don't allow deletion of active rate
    if (rate.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active rate. Please activate another rate first.'
      });
    }

    await Rate.findOneAndDelete({ id });
    
    res.json({
      success: true,
      message: 'Rate deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rate'
    });
  }
};

// Helper function to transform rates array
const transformRates = (rates: any[]): any[] => {
  return rates.map(transformRate);
};
