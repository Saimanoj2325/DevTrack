import React from 'react';
import { IssueStatus, IssuePriority } from '../types';

export const StatusBadge: React.FC<{ status: IssueStatus }> = ({ status }) => {
  const styles = {
    TODO: 'bg-slate-700/60 text-slate-300 border-slate-600',
    IN_PROGRESS: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    DONE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  };

  const labels = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: IssuePriority }> = ({ priority }) => {
  const styles = {
    LOW: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    HIGH: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${styles[priority]}`}>
      {priority}
    </span>
  );
};
