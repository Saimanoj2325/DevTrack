import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LayoutDashboard, FolderGit2, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3 text-sky-400 font-bold text-xl tracking-wide">
              <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span>Dev<span className="text-white">Track</span></span>
            </Link>

            {user && (
              <div className="hidden md:flex space-x-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/projects"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/projects')
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Projects</span>
                </Link>
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700 text-xs">
                <div className="w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-200 font-medium">{user.name}</span>
                <span className="text-slate-400 text-[10px] uppercase font-bold px-1.5 py-0.5 bg-slate-700 rounded">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-slate-400 hover:text-rose-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-rose-500/10"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
