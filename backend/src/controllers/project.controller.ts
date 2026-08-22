import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().default(''),
});

export const getProjects = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { issues: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parseResult = projectSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError(parseResult.error.errors[0].message, 400);
    }

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, description } = parseResult.data;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { issues: true },
        },
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        issues: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};
