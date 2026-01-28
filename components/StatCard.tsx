import React from 'react';

interface StatCardProps {
    label: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon: string;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    trend,
    isPositive,
    icon,
    colorClass,
}) => {
    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-5 shadow-card dark:shadow-card-dark flex items-start justify-between border border-transparent dark:border-border-dark transition-all hover:scale-[1.02]">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
                <p
                    className={`text-sm flex items-center mt-1 ${isPositive ? 'text-success' : 'text-danger'}`}
                >
                    <span className="material-symbols-outlined text-sm mr-1">
                        {isPositive ? 'trending_up' : 'trending_down'}
                    </span>
                    {trend}
                </p>
            </div>
            <div className={`p-2.5 rounded ${colorClass} bg-opacity-10`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
        </div>
    );
};

export default StatCard;
