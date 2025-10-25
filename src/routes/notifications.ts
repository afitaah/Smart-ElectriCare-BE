import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getAllNotifications, 
  getUnreadNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  createNotification 
} from '../controllers/notificationController';
import { authenticateToken, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Get all notifications
router.get('/', authenticateToken, getAllNotifications);

// Get unread notifications
router.get('/unread', authenticateToken, getUnreadNotifications);

// Mark notification as read
router.put('/:id/read', authenticateToken, markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', authenticateToken, markAllNotificationsAsRead);

// Create notification
router.post('/', [
  authenticateToken,
  authorize('Admin', 'Manager'),
  body('type').isNumeric().withMessage('Type must be a number'),
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('timestamp').notEmpty().withMessage('Timestamp is required'),
  body('priority').isNumeric().withMessage('Priority must be a number'),
  handleValidationErrors
], createNotification);

export default router;
