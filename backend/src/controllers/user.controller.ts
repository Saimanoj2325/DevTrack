import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
