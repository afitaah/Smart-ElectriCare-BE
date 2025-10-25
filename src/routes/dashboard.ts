import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get dashboard stats
router.get('/stats', authenticateToken, getDashboardStats);

export default router;
