import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const issueCreateSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().default(''),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  assigneeId: z.string().nullable().optional(),
});

const issueUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  assigneeId: z.string().nullable().optional(),
});

export const getIssues = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;

    const issues = await prisma.issue.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
};

export const createIssue = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parseResult = issueCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError(parseResult.error.errors[0].message, 400);
    }

    const { title, description, status, priority, projectId, assigneeId } = parseResult.data;

    // Check project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        projectId,
        assigneeId: assigneeId || null,
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(201).json(issue);
  } catch (error) {
    next(error);
  }
};

export const getIssueById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    return res.status(200).json(issue);
  } catch (error) {
    next(error);
  }
};

export const updateIssue = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const parseResult = issueUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError(parseResult.error.errors[0].message, 400);
    }

    const existingIssue = await prisma.issue.findUnique({ where: { id } });
    if (!existingIssue) {
      throw new AppError('Issue not found', 404);
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: parseResult.data,
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json(updatedIssue);
  } catch (error) {
    next(error);
  }
};

export const deleteIssue = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingIssue = await prisma.issue.findUnique({ where: { id } });
    if (!existingIssue) {
      throw new AppError('Issue not found', 404);
    }

    await prisma.issue.delete({ where: { id } });

    return res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const totalProjects = await prisma.project.count();
    const totalIssues = await prisma.issue.count();
    const openIssues = await prisma.issue.count({
      where: {
        status: { in: ['TODO', 'IN_PROGRESS'] },
      },
    });
    const completedIssues = await prisma.issue.count({
      where: {
        status: 'DONE',
      },
    });

    const recentIssues = await prisma.issue.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(200).json({
      totalProjects,
      totalIssues,
      openIssues,
      completedIssues,
      recentIssues,
    });
  } catch (error) {
    next(error);
  }
};
