
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { label: 'Dashboards', icon: 'dashboard', path: '/dashboard', badge: 5 },
    { label: 'Inscrições', icon: 'app_registration', path: '/inscricoes' },
    { label: 'Campistas', icon: 'group', path: '/campistas' },
    { label: 'Invoices', icon: 'receipt_long', path: '/invoices' },
  ];

  const settingsItems = [
    { label: 'Configuração', icon: 'settings', path: '/configuracao' },
    { label: 'Permissões', icon: 'security', path: '/permissoes' },
  ];

  return (
    <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:flex flex-col transition-colors duration-300 z-20">
      <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white">
          <span className="material-symbols-outlined text-primary text-2xl font-bold">camping</span>
          <span className="tracking-tight">Buscapé</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1">
        <div className="pb-2 px-3 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          Apps & Pages
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${isActive && item.path !== '#'
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-danger text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-6 pb-2 px-3 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          Settings
        </div>

        {settingsItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${isActive && item.path !== '#'
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-danger hover:bg-danger/10 rounded-md transition-all mt-8"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
