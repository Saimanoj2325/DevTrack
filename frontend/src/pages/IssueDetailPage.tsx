import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Issue, User, IssueStatus, IssuePriority } from '../types';
import { ArrowLeft, Trash2, Calendar, User as UserIcon, Check, FolderGit2 } from 'lucide-react';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editable fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('TODO');
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('');

  const fetchIssueDetails = async () => {
    try {
      const [issueRes, usersRes] = await Promise.all([
        api.get<Issue>(`/issues/${id}`),
        api.get<User[]>('/users'),
      ]);
      const data = issueRes.data;
      setIssue(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setStatus(data.status);
      setPriority(data.priority);
      setAssigneeId(data.assigneeId || '');
      setUsers(usersRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIssueDetails();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const updated = await api.put<Issue>(`/issues/${id}`, {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId || null,
      });
      setIssue(updated.data);
      setSuccessMsg('Issue updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update issue');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    try {
      await api.delete(`/issues/${id}`);
      if (issue?.projectId) {
        navigate(`/projects/${issue.projectId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete issue');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => (issue?.projectId ? navigate(`/projects/${issue.projectId}`) : navigate('/dashboard'))}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-sky-400 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project</span>
        </button>

        <button
          onClick={handleDelete}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Issue</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Main Details Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <FolderGit2 className="w-4 h-4" />
            <span>Project: {issue?.project?.name}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-bold bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Description
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
              placeholder="Describe the issue..."
            />
          </div>
        </div>

        {/* Metadata Controls Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-sky-500 text-sm"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as IssuePriority)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-sky-500 text-sm"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-sky-500 text-sm"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer info & Save Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Created {issue ? new Date(issue.createdAt).toLocaleDateString() : ''}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-sky-600/20 disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
