import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getAllBills, 
  getBillById, 
  getBillsByCustomerId, 
  createBill, 
  updateBill 
} from '../controllers/billController';
import { authenticateToken, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Get all bills
router.get('/', authenticateToken, getAllBills);

// Get bill by ID
router.get('/:id', authenticateToken, getBillById);

// Get bills by customer ID
router.get('/customer/:customerId', authenticateToken, getBillsByCustomerId);

// Create bill
router.post('/', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('dueDate').notEmpty().withMessage('Due date is required'),
  body('billingPeriod').notEmpty().withMessage('Billing period is required'),
  body('usageKwh').isNumeric().withMessage('Usage (kWh) must be a number'),
  handleValidationErrors
], createBill);

// Update bill
router.put('/:id', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  handleValidationErrors
], updateBill);

export default router;
