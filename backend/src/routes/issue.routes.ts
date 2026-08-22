import { Router } from 'express';
import {
  getIssues,
  createIssue,
  getIssueById,
  updateIssue,
  deleteIssue,
  getDashboardStats,
} from '../controllers/issue.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/dashboard/stats', getDashboardStats);

router.get('/issues', getIssues);
router.post('/issues', createIssue);
router.get('/issues/:id', getIssueById);
router.put('/issues/:id', updateIssue);
router.delete('/issues/:id', deleteIssue);

export default router;
