import React from 'react';

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = 'Buscar...',
    value,
    onChange,
    className = '',
}) => {
    return (
        <div className={`relative ${className}`}>
            <input
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-md text-sm text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary w-full"
                placeholder={placeholder}
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
            </span>
        </div>
    );
};

export default SearchInput;
