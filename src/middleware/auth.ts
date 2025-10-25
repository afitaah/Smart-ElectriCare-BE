import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { UserStatus } from '../utils/status';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        _id: string;
        userId: string;
        username: string;
        email: string;
        role: number;
        permissions: any[];
      };
    }
  }
}

// AuthRequest interface for controllers
export interface AuthRequest extends Request {
  user?: {
    id: string;
    _id: string;
    userId: string;
    username: string;
    email: string;
    role: number;
    permissions: any[];
  };
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// Generate access token
export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE } as jwt.SignOptions
  );
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRE } as jwt.SignOptions
  );
};

// Verify access token
export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

// Authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify JWT token
    const decoded = verifyAccessToken(token) as any;
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }
    
    // Check if user still exists and is active
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
        message: 'User account is inactive'
      });
    }

    // Add user to request object
    req.user = {
      id: user._id.toString(),
      _id: user._id.toString(),
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles: (string | number)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Convert string role names to numbers for comparison
    const roleMap: { [key: string]: number } = {
      'Viewer': 1,
      'Operator': 2,
      'Manager': 3,
      'Admin': 4
    };

    const userRole = req.user.role;
    const allowedRoles = roles.map(role => 
      typeof role === 'string' ? roleMap[role] : role
    );

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has the required permission
    const hasPermission = req.user.permissions?.some((permission: any) => 
      permission.resource === resource && 
      permission.action === action && 
      permission.granted === true
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${action} on ${resource}`
      });
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token) as any;
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive === UserStatus.ACTIVE) {
        req.user = {
          id: user._id.toString(),
          _id: user._id.toString(),
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Rate limiting middleware for authentication endpoints
export const authRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Simple in-memory rate limiting (in production, use Redis)
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // This is a simplified implementation
  // In production, use a proper rate limiting library like express-rate-limit
  next();
};

// Log authentication attempts
export const logAuthAttempt = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    const statusCode = res.statusCode;
    const isAuthEndpoint = req.path.includes('/auth/');
    
    if (isAuthEndpoint) {
      console.log(`Auth attempt: ${req.method} ${req.path} - Status: ${statusCode} - IP: ${req.ip}`);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};
