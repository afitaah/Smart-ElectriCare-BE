import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getAllRates, 
  getActiveRate,
  getRateById, 
  createRate, 
  updateRate,
  deleteRate
} from '../controllers/rateController';
import { authenticateToken, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Get all rates
router.get('/', authenticateToken, getAllRates);

// Get active rate
router.get('/active', authenticateToken, getActiveRate);

// Get rate by ID
router.get('/:id', authenticateToken, getRateById);

// Create rate
router.post('/', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  body('rateValue').isNumeric().withMessage('Rate value must be a number'),
  body('effectiveDate').notEmpty().withMessage('Effective date is required'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
  handleValidationErrors
], createRate);

// Update rate
router.put('/:id', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  body('rateValue').optional().isNumeric().withMessage('Rate value must be a number'),
  body('effectiveDate').optional().notEmpty().withMessage('Effective date is required'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
  handleValidationErrors
], updateRate);

// Delete rate
router.delete('/:id', [
  authenticateToken,
  authorize('Admin'),
  handleValidationErrors
], deleteRate);

export default router;
