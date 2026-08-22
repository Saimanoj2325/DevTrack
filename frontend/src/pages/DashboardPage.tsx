import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/IssueBadge';
import { FolderGit2, CheckCircle2, AlertCircle, Clock, ArrowRight, PlusCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<DashboardStats>('/dashboard/stats');
        setStats(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time status of projects and open issues</p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-sky-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>View Projects</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={<FolderGit2 className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="Total Issues"
          value={stats?.totalIssues || 0}
          icon={<Clock className="w-6 h-6" />}
          color="sky"
        />
        <StatCard
          title="Open Issues"
          value={stats?.openIssues || 0}
          icon={<AlertCircle className="w-6 h-6" />}
          color="amber"
        />
        <StatCard
          title="Completed Issues"
          value={stats?.completedIssues || 0}
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="emerald"
        />
      </div>

      {/* Recent Issues List */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Issues</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest issues created across all active projects</p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <span>Browse Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentIssues && stats.recentIssues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {issue.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {issue.project?.name || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
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
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/issues/${issue.id}`}
                        className="inline-flex items-center px-2.5 py-1 bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p className="text-sm">No issues created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
