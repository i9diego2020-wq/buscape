
import React from 'react';
import { User } from '../types';
import useDarkMode from '../hooks/useDarkMode';
import Avatar from './Avatar';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const { toggleDarkMode } = useDarkMode();

  return (
    <header className="h-16 mx-4 mt-4 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border border-border-light dark:border-border-dark flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 transition-colors duration-300 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors cursor-pointer group">
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">search</span>
          <span className="text-sm font-medium">Search (Ctrl+K)</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors group">
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">translate</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-[20px] dark:hidden group-hover:scale-110 transition-transform">dark_mode</span>
          <span className="material-symbols-outlined text-[20px] hidden dark:block group-hover:scale-110 transition-transform">light_mode</span>
        </button>

        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors relative group">
          <span className="material-symbols-outlined text-[20px] group-hover:shake transition-all">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white dark:ring-surface-dark"></span>
        </button>

        <div className="flex items-center gap-3 ml-2 border-l border-border-light dark:border-border-dark pl-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-700 dark:text-white leading-tight">{user?.name || 'Admin User'}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{user?.role || 'Staff'}</p>
          </div>
          <button onClick={onLogout} title="Sair">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Admin'}
              size="sm"
              className="ring-2 ring-white dark:ring-slate-700 shadow-sm cursor-pointer hover:ring-primary transition-all"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
