import { Router } from 'express';
import { body, query } from 'express-validator';
import { 
  getAllCustomers, 
  getCustomerById, 
  getFilteredCustomers, 
  updateCustomer, 
  createCustomer 
} from '../controllers/customerController';
import { authenticateToken, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { getFilterConfig } from '../utils/globalFilter';

const router = Router();

// Get all customers (with optional filtering)
router.get('/', authenticateToken, getAllCustomers);

// Get filtered customers (alternative endpoint)
router.get('/filter', authenticateToken, getFilteredCustomers);

// Get customer by ID
router.get('/:id', authenticateToken, getCustomerById);

// Create customer
router.post('/', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('watchId').notEmpty().withMessage('Watch ID is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('registrationDate').notEmpty().withMessage('Registration date is required'),
  handleValidationErrors
], createCustomer);

// Update customer
router.put('/:id', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  handleValidationErrors
], updateCustomer);

export default router;
