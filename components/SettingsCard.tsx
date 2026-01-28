import React from 'react';

interface SettingsCardProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    onAdd?: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, icon, children, onAdd }) => {
    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark overflow-hidden h-full flex flex-col transition-all">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">{icon}</span>
                    {title}
                </h3>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="text-primary hover:bg-primary/10 p-1.5 rounded-md transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    </button>
                )}
            </div>
            <div className="p-6 flex-1">{children}</div>
        </div>
    );
};

export default SettingsCard;
