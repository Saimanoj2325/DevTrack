import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Project, Issue, User, IssueStatus, IssuePriority } from '../types';
import { Modal } from '../components/Modal';
import { StatusBadge, PriorityBadge } from '../components/IssueBadge';
import { FolderGit2, Plus, ArrowLeft, Calendar, User as UserIcon, AlertCircle } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for creating issue
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('TODO');
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        api.get<Project & { issues: Issue[] }>(`/projects/${id}`),
        api.get<User[]>('/users'),
      ]);
      setProject(projRes.data);
      setUsers(usersRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await api.post('/issues', {
        title,
        description,
        status,
        priority,
        projectId: id,
        assigneeId: assigneeId || null,
      });

      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setAssigneeId('');
      setIsModalOpen(false);
      fetchProjectDetails();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create issue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/projects" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
          {error || 'Project not found'}
        </div>
      </div>
    );
  }

  // Type assertion for project with issues
  const projectWithIssues = project as Project & { issues: Issue[] };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/projects"
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-sky-400 text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Header Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{project.name}</h1>
            </div>
            <p className="text-slate-300 text-sm max-w-3xl mt-2">{project.description || 'No description provided.'}</p>

            <div className="flex items-center space-x-6 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800/60">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span>Manager: {project.createdBy?.name || 'Admin'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-sky-600/20 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Create Issue</span>
          </button>
        </div>
      </div>

      {/* Issues Section */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Project Issues ({projectWithIssues.issues?.length || 0})</h2>
        </div>

        {projectWithIssues.issues && projectWithIssues.issues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projectWithIssues.issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {issue.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      {issue.assignee?.name ? (
                        <div className="flex items-center space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-700 text-[10px] font-bold flex items-center justify-center text-slate-200">
                            {issue.assignee.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{issue.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/issues/${issue.id}`}
                        className="inline-flex items-center px-3 py-1 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View & Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-300">No issues created in this project yet.</p>
            <p className="text-xs text-slate-500 mt-1">Click "Create Issue" above to add the first issue.</p>
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Issue">
        {formError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix authentication timeout bug"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide steps to reproduce or expected behavior"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-sky-500 text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-sky-500 text-sm"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-sky-500 text-sm"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
