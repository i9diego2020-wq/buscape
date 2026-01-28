
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Avatar from '../components/Avatar';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

interface Registration {
    id: string;
    created_at: string;
    season: string;
    period: string | null;
    child_name: string;
    child_age: number | null;
    mother_name: string | null;
    father_name: string | null;
    mother_phone: string | null;
    father_phone: string | null;
    signature_data: string | null;
    status: string;
}

const ITEMS_PER_PAGE = 6;

const RegistrationsListView: React.FC = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Registration | null }>({ open: false, item: null });

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('registrations')
                .select('id, created_at, season, period, child_name, child_age, mother_name, father_name, mother_phone, father_phone, signature_data, status')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setRegistrations(data || []);
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar inscrições');
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistrations = useMemo(() => {
        return registrations.filter(reg =>
            reg.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.mother_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.father_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [registrations, searchTerm]);

    const paginatedRegistrations = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRegistrations.slice(start, start + itemsPerPage);
    }, [filteredRegistrations, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

    const handleDelete = async () => {
        if (deleteModal.item) {
            try {
                await supabase.from('registrations').delete().eq('id', deleteModal.item.id);
                setRegistrations(prev => prev.filter(r => r.id !== deleteModal.item?.id));
                setDeleteModal({ open: false, item: null });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(paginatedRegistrations.map(r => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return 'Aprovado';
            case 'pending': return 'Pendente';
            case 'rejected': return 'Rejeitado';
            default: return status;
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await supabase.from('registrations').update({ status: 'approved' }).eq('id', id);
            setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gerenciamento de Inscrições</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize e gerencie as fichas de inscrição recebidas.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark overflow-hidden border border-transparent dark:border-border-dark">
                <div className="p-5 border-b border-slate-100 dark:border-border-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Mostrar</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-md text-sm p-1 px-2 focus:ring-primary text-slate-700 dark:text-slate-200"
                        >
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <SearchInput
                            placeholder="Buscar por nome ou responsável..."
                            className="w-full sm:w-64"
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">print</span>
                            Imprimir
                        </button>
                        <button
                            onClick={() => navigate('/inscricoes/nova')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Nova Inscrição
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-border-dark text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                                <th className="p-4 w-4">
                                    <input
                                        className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-transparent cursor-pointer"
                                        type="checkbox"
                                        checked={selectedIds.length === paginatedRegistrations.length && paginatedRegistrations.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th className="p-4">Campista</th>
                                <th className="p-4">Idade</th>
                                <th className="p-4">Responsável</th>
                                <th className="p-4">Contato</th>
                                <th className="p-4">Temporada</th>
                                <th className="p-4">Assinatura</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                            {paginatedRegistrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-4">
                                        <input
                                            className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-transparent cursor-pointer"
                                            type="checkbox"
                                            checked={selectedIds.includes(reg.id)}
                                            onChange={(e) => handleSelectOne(reg.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={reg.child_name} size="sm" />
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{reg.child_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{reg.child_age ? `${reg.child_age} anos` : '-'}</td>
                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-200 font-medium">{reg.mother_name || reg.father_name || '-'}</td>
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{reg.mother_phone || reg.father_phone || '-'}</td>
                                    <td className="p-4">
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{reg.season}</span>
                                    </td>
                                    <td className="p-4">
                                        {reg.signature_data ? (
                                            <span className="material-symbols-outlined text-success text-xl" title="Assinado">verified</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-slate-300 text-xl opacity-50" title="Sem assinatura">pending</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge variant={getStatusVariant(reg.status)}>
                                            {getStatusLabel(reg.status)}
                                        </StatusBadge>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => navigate(`/inscricoes/${reg.id}`)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                                                title="Ver detalhes"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            {reg.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(reg.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-success/10 hover:text-success transition-all"
                                                    title="Aprovar"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setDeleteModal({ open: true, item: reg })}
                                                className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-danger/10 hover:text-danger transition-all"
                                                title="Excluir"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
                                        {searchTerm ? 'Nenhuma inscrição encontrada' : 'Nenhuma inscrição ainda'}
                                        {!searchTerm && (
                                            <p className="mt-2 text-sm">
                                                <a href="/#/inscricao" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                    Ver formulário público →
                                                </a>
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    showingFrom={(currentPage - 1) * itemsPerPage + 1}
                    showingTo={Math.min(currentPage * itemsPerPage, filteredRegistrations.length)}
                    totalItems={filteredRegistrations.length}
                    onPageChange={setCurrentPage}
                />
            </div>

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, item: null })}
                onConfirm={handleDelete}
                itemName={deleteModal.item?.child_name || ''}
            />
        </div>
    );
};

export default RegistrationsListView;
