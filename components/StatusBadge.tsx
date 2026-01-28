import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';

interface StatusBadgeProps {
    children: React.ReactNode;
    variant: BadgeVariant;
    size?: 'sm' | 'md';
    dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
};

const dotClasses: Record<BadgeVariant, string> = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
    children,
    variant,
    size = 'sm',
    dot = false,
}) => {
    const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded ${sizeClass} font-bold uppercase tracking-wide ${variantClasses[variant]}`}
        >
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />}
            {children}
        </span>
    );
};

export default StatusBadge;
