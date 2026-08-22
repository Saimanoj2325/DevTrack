import { Router } from 'express';
import { getProjects, createProject, getProjectById } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/projects', getProjects);
router.post('/projects', createProject);
router.get('/projects/:id', getProjectById);

export default router;
