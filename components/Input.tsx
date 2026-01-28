import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    htmlFor={inputId}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2 transition-all ${error ? 'border-danger' : ''
                    } ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
};

export default Input;
