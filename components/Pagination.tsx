import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    showingFrom: number;
    showingTo: number;
    totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showingFrom,
    showingTo,
    totalItems,
}) => {
    const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

    return (
        <div className="p-5 border-t border-slate-100 dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-400">
                Mostrando {showingFrom} a {showingTo} de {totalItems} entradas
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange?.(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded text-sm ${page === currentPage
                                ? 'bg-primary text-white shadow-md shadow-primary/30 font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
