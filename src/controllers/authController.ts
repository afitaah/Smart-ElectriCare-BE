import { Request, Response } from 'express';
import User from '../models/User';
import { LoginRequest, AuthResponse, RefreshTokenRequest } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import { UserStatus } from '../utils/status';

// Login controller
export const login = async (req: Request<{}, AuthResponse, LoginRequest>, res: Response<AuthResponse>) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.isActive !== UserStatus.ACTIVE) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Remove password from response
    const userResponse = user.toObject() as any;
    delete userResponse.password;

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh token controller
export const refreshToken = async (req: Request<{}, AuthResponse, RefreshTokenRequest>, res: Response<AuthResponse>) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken) as any;
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isActive !== UserStatus.ACTIVE) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id.toString());

    // Remove password from response
    const userResponse = user.toObject() as any;
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newAccessToken,
      user: userResponse
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout controller
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user controller
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find user to get latest data
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const userResponse = user.toObject() as any;
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User data retrieved successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
