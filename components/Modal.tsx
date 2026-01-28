import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    footer?: React.ReactNode;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer,
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative w-full ${sizeClasses[size]} bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl transform transition-all`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-border-dark">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-border-dark">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
