import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getAllUsers, 
  getUserById, 
  getFilteredUsers, 
  updateUser, 
  createUser 
} from '../controllers/userController';
import { authenticateToken, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Get all users
router.get('/', authenticateToken, authorize('Admin', 'Manager'), getAllUsers);

// Get filtered users
router.get('/filter', authenticateToken, authorize('Admin', 'Manager'), getFilteredUsers);

// Get user by ID
router.get('/:id', authenticateToken, getUserById);

// Create user
router.post('/', [
  authenticateToken,
  authorize('Admin'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isNumeric().withMessage('Role must be a number'),
  body('createdAt').notEmpty().withMessage('Created date is required'),
  handleValidationErrors
], createUser);

// Update user
router.put('/:id', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  handleValidationErrors
], updateUser);

export default router;
