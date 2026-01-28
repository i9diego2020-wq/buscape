
import React, { useState } from 'react';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';

interface Invoice {
    id: string;
    camperName: string;
    email: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
}

const MOCK_INVOICES: Invoice[] = [
    { id: 'INV-001', camperName: 'Jordan Stevenson', email: 'jordan@example.com', date: '24 Jan, 2026', dueDate: '07 Fev, 2026', amount: 1200.00, status: 'paid' },
    { id: 'INV-002', camperName: 'Richard Brown', email: 'richard.b@example.com', date: '23 Jan, 2026', dueDate: '06 Fev, 2026', amount: 950.00, status: 'pending' },
    { id: 'INV-003', camperName: 'Sarah Jenkins', email: 'sarah.j@example.com', date: '22 Jan, 2026', dueDate: '05 Fev, 2026', amount: 1200.00, status: 'overdue' },
    { id: 'INV-004', camperName: 'Bentlee Emblin', email: 'bemblin@example.com', date: '20 Jan, 2026', dueDate: '03 Fev, 2026', amount: 1350.00, status: 'paid' },
    { id: 'INV-005', camperName: 'Benedicto Müller', email: 'benedicto@example.com', date: '18 Jan, 2026', dueDate: '01 Fev, 2026', amount: 1200.00, status: 'pending' },
];

const getStatusVariant = (status: Invoice['status']): 'success' | 'warning' | 'danger' => {
    switch (status) {
        case 'paid': return 'success';
        case 'pending': return 'warning';
        case 'overdue': return 'danger';
    }
};

const getStatusLabel = (status: Invoice['status']): string => {
    switch (status) {
        case 'paid': return 'Pago';
        case 'pending': return 'Pendente';
        case 'overdue': return 'Vencido';
    }
};

const InvoicesView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredInvoices = MOCK_INVOICES.filter(inv =>
        inv.camperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPaid = MOCK_INVOICES.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
    const totalPending = MOCK_INVOICES.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0);
    const totalOverdue = MOCK_INVOICES.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Faturas</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie pagamentos e faturas dos campistas.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-5 shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Pago</p>
                            <p className="text-2xl font-bold text-success">R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-success/10">
                            <span className="material-symbols-outlined text-success text-2xl">check_circle</span>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-5 shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Pendente</p>
                            <p className="text-2xl font-bold text-warning">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-warning/10">
                            <span className="material-symbols-outlined text-warning text-2xl">schedule</span>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-5 shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Vencido</p>
                            <p className="text-2xl font-bold text-danger">R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-danger/10">
                            <span className="material-symbols-outlined text-danger text-2xl">warning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark overflow-hidden border border-transparent dark:border-border-dark">
                <div className="p-5 border-b border-slate-100 dark:border-border-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Todas as Faturas</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <SearchInput
                            placeholder="Buscar fatura..."
                            className="w-full sm:w-64"
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Nova Fatura
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-border-dark text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                                <th className="p-4">Fatura</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Data</th>
                                <th className="p-4">Vencimento</th>
                                <th className="p-4">Valor</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-4">
                                        <span className="text-sm font-semibold text-primary">{inv.id}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{inv.camperName}</span>
                                            <span className="text-xs text-slate-400">{inv.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{inv.date}</td>
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{inv.dueDate}</td>
                                    <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge variant={getStatusVariant(inv.status)} size="md">
                                            {getStatusLabel(inv.status)}
                                        </StatusBadge>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all" title="Ver">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-info transition-all" title="Download">
                                                <span className="material-symbols-outlined text-[18px]">download</span>
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-success transition-all" title="Enviar">
                                                <span className="material-symbols-outlined text-[18px]">send</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={3}
                    showingFrom={1}
                    showingTo={filteredInvoices.length}
                    totalItems={15}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default InvoicesView;
