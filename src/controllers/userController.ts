import { Request, Response } from 'express';
import User from '../models/User';
import { ApiResponse, User as UserType, UserFilter } from '../types';
import { AuthRequest } from '../middleware/auth';
import { transformUser, transformUsers } from '../utils/transformers';
import { UserRole, UserStatus } from '../utils/status';

export const getAllUsers = async (req: Request, res: Response<ApiResponse<UserType[]>>) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const transformedUsers = transformUsers(users as any);
    
    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: transformedUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

export const getUserById = async (req: Request, res: Response<ApiResponse<UserType>>) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const transformedUser = transformUser(user as any);
    
    res.json({
      success: true,
      message: 'User fetched successfully',
      data: transformedUser
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

export const getFilteredUsers = async (req: Request, res: Response<ApiResponse<UserType[]>>) => {
  try {
    const filter: UserFilter = req.query;
    let query: any = {};

    // Build query based on filters
    if (filter.role) {
      // Convert role string to number
      const roleMap: { [key: string]: number } = {
        'Admin': UserRole.ADMIN,
        'Manager': UserRole.MANAGER,
        'Operator': UserRole.OPERATOR,
        'Viewer': UserRole.VIEWER
      };
      query.role = roleMap[filter.role];
    }
    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    }
    if (filter.search) {
      query.$or = [
        { username: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
        { department: { $regex: filter.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    const transformedUsers = transformUsers(users as any);
    
    res.json({
      success: true,
      message: 'Filtered users fetched successfully',
      data: transformedUsers
    });
  } catch (error) {
    console.error('Get filtered users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered users'
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response<ApiResponse<UserType>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating password through this endpoint
    delete updates.password;

    const user = await User.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const transformedUser = transformUser(user as any);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: transformedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

export const createUser = async (req: AuthRequest, res: Response<ApiResponse<UserType>>) => {
  try {
    const userData = req.body;
    
    // Generate unique ID
    const count = await User.countDocuments();
    userData.id = `USER${String(count + 1).padStart(4, '0')}`;
    
    const user = new User(userData);
    await user.save();
    
    const transformedUser = transformUser(user as any);
    // Remove password from response
    delete transformedUser.password;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: transformedUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};
