
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationStatus, Season, Registration } from '../types';
import StatCard from '../components/StatCard';
import Avatar from '../components/Avatar';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import FilterModal, { FilterValues } from '../components/FilterModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const MOCK_REGISTRATIONS: Registration[] = [
  { id: '1', childName: 'Jordan Stevenson', email: 'jordan@example.com', date: '24 Out, 2023', season: Season.SUMMER_2024, paymentAmount: 350.00, status: RegistrationStatus.APPROVED, avatar: 'https://picsum.photos/seed/jordan/100' },
  { id: '2', childName: 'Richard Brown', email: 'richard.b@example.com', date: '23 Out, 2023', season: Season.WINTER_2024, paymentAmount: 120.00, status: RegistrationStatus.PENDING },
  { id: '3', childName: 'Sarah Jenkins', email: 'sarah.j@example.com', date: '22 Out, 2023', season: Season.SUMMER_2024, paymentAmount: 350.00, status: RegistrationStatus.REJECTED, avatar: 'https://picsum.photos/seed/sarah/100' },
  { id: '4', childName: 'Bentlee Emblin', email: 'bemblin@example.com', date: '18 Out, 2023', season: Season.WINTER_2024, paymentAmount: 120.00, status: RegistrationStatus.APPROVED, avatar: 'https://picsum.photos/seed/bentlee/100' },
  { id: '5', childName: 'Benedicto Müller', email: 'benedicto@example.com', date: '15 Out, 2023', season: Season.SUMMER_2024, paymentAmount: 350.00, status: RegistrationStatus.PENDING },
  { id: '6', childName: 'Ana Carolina', email: 'ana.c@example.com', date: '14 Out, 2023', season: Season.SUMMER_2024, paymentAmount: 350.00, status: RegistrationStatus.APPROVED, avatar: 'https://picsum.photos/seed/ana/100' },
  { id: '7', childName: 'Pedro Henrique', email: 'pedro.h@example.com', date: '13 Out, 2023', season: Season.WINTER_2024, paymentAmount: 120.00, status: RegistrationStatus.PENDING },
  { id: '8', childName: 'Maria Eduarda', email: 'maria.e@example.com', date: '12 Out, 2023', season: Season.SUMMER_2024, paymentAmount: 350.00, status: RegistrationStatus.APPROVED },
];

const ITEMS_PER_PAGE = 5;

const getStatusVariant = (status: RegistrationStatus): 'success' | 'warning' | 'danger' => {
  switch (status) {
    case RegistrationStatus.APPROVED:
      return 'success';
    case RegistrationStatus.PENDING:
      return 'warning';
    case RegistrationStatus.REJECTED:
      return 'danger';
  }
};

const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Registration | null }>({ open: false, item: null });
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      // Search filter
      const matchesSearch = reg.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = !filters.status || reg.status === filters.status;

      // Season filter
      const matchesSeason = !filters.season || reg.season === filters.season;

      return matchesSearch && matchesStatus && matchesSeason;
    });
  }, [registrations, searchTerm, filters]);

  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRegistrations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRegistrations, currentPage]);

  const totalPages = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);

  const handleDelete = () => {
    if (deleteModal.item) {
      setRegistrations(prev => prev.filter(r => r.id !== deleteModal.item?.id));
      setDeleteModal({ open: false, item: null });
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total de Inscrições" value="21,459" trend="+29% semana" isPositive={true} icon="group_add" colorClass="text-primary bg-primary" />
        <StatCard label="Aprovações Pendentes" value="142" trend="Últimos 7 dias" isPositive={true} icon="pending_actions" colorClass="text-warning bg-warning" />
        <StatCard label="Receita Total" value="R$ 48.250" trend="+18% mês" isPositive={true} icon="payments" colorClass="text-success bg-success" />
        <StatCard label="Cancelamentos" value="18" trend="-2% semana" isPositive={false} icon="person_off" colorClass="text-danger bg-danger" />
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark overflow-hidden border border-transparent dark:border-border-dark">
        <div className="p-5 border-b border-slate-100 dark:border-border-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Inscrições Recentes</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              placeholder="Buscar campista..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${Object.keys(filters).length > 0
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filtros
                {Object.values(filters).filter(Boolean).length > 0 && (
                  <span className="bg-white text-primary text-xs px-1.5 rounded-full font-bold">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/inscricoes')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Nova Inscrição
              </button>
            </div>
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
                <th className="p-4">Inscrito</th>
                <th className="p-4">Data</th>
                <th className="p-4">Temporada</th>
                <th className="p-4">Pagamento</th>
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
                      <Avatar src={reg.avatar} name={reg.childName} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{reg.childName}</span>
                        <span className="text-xs text-slate-400">{reg.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{reg.date}</td>
                  <td className="p-4">
                    <StatusBadge
                      variant={reg.season.includes('Summer') ? 'info' : 'primary'}
                      size="md"
                      dot
                    >
                      {reg.season}
                    </StatusBadge>
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-200">R$ {reg.paymentAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <StatusBadge variant={getStatusVariant(reg.status)} size="md">
                      {reg.status}
                    </StatusBadge>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate('/inscricoes')}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, item: reg })}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-danger transition-all"
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
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                    Nenhuma inscrição encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          showingFrom={(currentPage - 1) * ITEMS_PER_PAGE + 1}
          showingTo={Math.min(currentPage * ITEMS_PER_PAGE, filteredRegistrations.length)}
          totalItems={filteredRegistrations.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={setFilters}
        type="registrations"
      />

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        itemName={deleteModal.item?.childName || ''}
      />
    </div>
  );
};

export default DashboardView;
