import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import issueRoutes from './routes/issue.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', issueRoutes);

// Error Middleware
app.use(errorHandler);

export default app;
