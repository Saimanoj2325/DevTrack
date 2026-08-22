import request from 'supertest';
import app from '../app';
import { prisma } from '../utils/prisma';

// Mock Prisma Client for Unit/Integration testing
jest.mock('../utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    project: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    issue: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('DevTrack API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 OK with status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$hashedpassword',
        role: 'DEVELOPER',
        createdAt: new Date(),
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('john@example.com');
    });

    it('should return error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'john@example.com',
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return token', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'DEVELOPER',
        createdAt: new Date(),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('POST /api/issues', () => {
    it('should create an issue for authenticated user', async () => {
      const token = require('../utils/jwt').generateToken({
        userId: 'user-1',
        email: 'john@example.com',
        role: 'DEVELOPER',
      });

      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: 'proj-1',
        name: 'DevTrack Project',
      });

      (prisma.issue.create as jest.Mock).mockResolvedValue({
        id: 'issue-1',
        title: 'Fix Login Bug',
        description: 'Login throws error',
        status: 'TODO',
        priority: 'HIGH',
        projectId: 'proj-1',
        assigneeId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        project: { id: 'proj-1', name: 'DevTrack Project' },
        assignee: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
      });

      const res = await request(app)
        .post('/api/issues')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Fix Login Bug',
          description: 'Login throws error',
          status: 'TODO',
          priority: 'HIGH',
          projectId: 'proj-1',
          assigneeId: 'user-1',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Fix Login Bug');
    });
  });
});
