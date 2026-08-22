export type Role = 'ADMIN' | 'DEVELOPER';
export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    issues: number;
  };
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string;
  project?: {
    id: string;
    name: string;
  };
  assigneeId?: string | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalIssues: number;
  openIssues: number;
  completedIssues: number;
  recentIssues: Issue[];
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
