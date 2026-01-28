import React from 'react';

interface FormSectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children, className = '' }) => {
    return (
        <section
            className={`bg-surface-light dark:bg-surface-dark rounded-xl shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark overflow-hidden mb-6 ${className}`}
        >
            <div className="border-b border-slate-100 dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">{icon}</span>
                    {title}
                </h3>
            </div>
            <div className="p-6 md:p-8">{children}</div>
        </section>
    );
};

export default FormSection;
