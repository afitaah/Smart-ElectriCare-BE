import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getAllPayments, 
  getPaymentById, 
  getPaymentsByCustomerId, 
  createPayment 
} from '../controllers/paymentController';
import { authenticateToken, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Get all payments
router.get('/', authenticateToken, getAllPayments);

// Get payment by ID
router.get('/:id', authenticateToken, getPaymentById);

// Get payments by customer ID
router.get('/customer/:customerId', authenticateToken, getPaymentsByCustomerId);

// Create payment
router.post('/', [
  authenticateToken,
  authorize('Admin', 'Manager', 'Operator'),
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('billId').notEmpty().withMessage('Bill ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentDate').notEmpty().withMessage('Payment date is required'),
  body('paymentMethod').isNumeric().withMessage('Payment method must be a number'),
  handleValidationErrors
], createPayment);

export default router;
