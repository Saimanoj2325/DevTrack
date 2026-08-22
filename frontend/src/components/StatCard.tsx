import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'sky' | 'indigo' | 'amber' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorStyles = {
    sky: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  };

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-3xl font-extrabold mt-2 text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg border ${colorStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
};
