import { Router } from 'express';
import { body } from 'express-validator';
import { login, refreshToken, logout, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Login route
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
], login);

// Refresh token route
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  handleValidationErrors
], refreshToken);

// Logout route
router.post('/logout', logout);

// Get current user route
router.get('/me', authenticateToken, getCurrentUser);

export default router;
