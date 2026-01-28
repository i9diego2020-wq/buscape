
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Season, Camper } from '../types';
import Avatar from '../components/Avatar';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import FilterModal, { FilterValues } from '../components/FilterModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Modal from '../components/Modal';
import Input from '../components/Input';

const INITIAL_CAMPISTAS: Camper[] = [
  { id: '1', name: 'Jordan Stevenson', age: 12, lastSeason: Season.SUMMER_2024, parentName: 'Mary Stevenson', parentPhone: '(11) 98888-7777', status: 'Active', avatar: 'https://picsum.photos/seed/jordan/100', healthAlert: true },
  { id: '2', name: 'Richard Brown', age: 10, lastSeason: Season.WINTER_2024, parentName: 'John Brown', parentPhone: '(11) 97777-6666', status: 'Active' },
  { id: '3', name: 'Sarah Jenkins', age: 14, lastSeason: Season.SUMMER_2024, parentName: 'Alice Jenkins', parentPhone: '(11) 96666-5555', status: 'Inactive', avatar: 'https://picsum.photos/seed/sarah/100' },
  { id: '4', name: 'Bentlee Emblin', age: 9, lastSeason: Season.WINTER_2024, parentName: 'Robert Emblin', parentPhone: '(11) 95555-4444', status: 'Active', avatar: 'https://picsum.photos/seed/bentlee/100' },
  { id: '5', name: 'Benedicto Müller', age: 11, lastSeason: Season.SUMMER_2024, parentName: 'Greta Müller', parentPhone: '(11) 94444-3333', status: 'Active', healthAlert: true },
  { id: '6', name: 'Livia Costa', age: 13, lastSeason: Season.SUMMER_2026, parentName: 'Carlos Costa', parentPhone: '(11) 93333-2222', status: 'Active', avatar: 'https://picsum.photos/seed/livia/100' },
  { id: '7', name: 'Lucas Ferreira', age: 8, lastSeason: Season.WINTER_2024, parentName: 'Ana Ferreira', parentPhone: '(11) 92222-1111', status: 'Active' },
  { id: '8', name: 'Mariana Santos', age: 15, lastSeason: Season.SUMMER_2024, parentName: 'Paulo Santos', parentPhone: '(11) 91111-0000', status: 'Inactive', avatar: 'https://picsum.photos/seed/mariana/100' },
];

const ITEMS_PER_PAGE = 6;

interface CamperFormData {
  name: string;
  age: string;
  parentName: string;
  parentPhone: string;
  status: 'Active' | 'Inactive';
}

const CampistasView: React.FC = () => {
  const navigate = useNavigate();
  const [campistas, setCampistas] = useState(INITIAL_CAMPISTAS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [filters, setFilters] = useState<FilterValues>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Camper | null }>({ open: false, item: null });
  const [formModal, setFormModal] = useState<{ open: boolean; mode: 'add' | 'edit'; camper: Camper | null }>({ open: false, mode: 'add', camper: null });
  const [formData, setFormData] = useState<CamperFormData>({ name: '', age: '', parentName: '', parentPhone: '', status: 'Active' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredCampistas = useMemo(() => {
    return campistas.filter(camper => {
      const matchesSearch = camper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camper.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || camper.status === filters.status;

      const matchesAge = (!filters.ageMin || camper.age >= filters.ageMin) &&
        (!filters.ageMax || camper.age <= filters.ageMax);

      return matchesSearch && matchesStatus && matchesAge;
    });
  }, [campistas, searchTerm, filters]);

  const paginatedCampistas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCampistas.slice(start, start + itemsPerPage);
  }, [filteredCampistas, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCampistas.length / itemsPerPage);

  const handleDelete = () => {
    if (deleteModal.item) {
      setCampistas(prev => prev.filter(c => c.id !== deleteModal.item?.id));
      setDeleteModal({ open: false, item: null });
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', age: '', parentName: '', parentPhone: '', status: 'Active' });
    setFormModal({ open: true, mode: 'add', camper: null });
  };

  const openEditModal = (camper: Camper) => {
    setFormData({
      name: camper.name,
      age: camper.age.toString(),
      parentName: camper.parentName,
      parentPhone: camper.parentPhone,
      status: camper.status as 'Active' | 'Inactive',
    });
    setFormModal({ open: true, mode: 'edit', camper });
  };

  const handleFormSubmit = () => {
    if (formModal.mode === 'add') {
      const newCamper: Camper = {
        id: (campistas.length + 1).toString(),
        name: formData.name,
        age: parseInt(formData.age),
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        lastSeason: Season.SUMMER_2026,
        status: formData.status,
      };
      setCampistas(prev => [newCamper, ...prev]);
    } else if (formModal.camper) {
      setCampistas(prev => prev.map(c =>
        c.id === formModal.camper?.id
          ? { ...c, name: formData.name, age: parseInt(formData.age), parentName: formData.parentName, parentPhone: formData.parentPhone, status: formData.status }
          : c
      ));
    }
    setFormModal({ open: false, mode: 'add', camper: null });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedCampistas.map(c => c.id));
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gerenciamento de Campistas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize e edite as informações de todos os participantes.</p>
        </div>
      </div>

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
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${Object.keys(filters).length > 0
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filtros
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              Adicionar Campista
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
                    checked={selectedIds.length === paginatedCampistas.length && paginatedCampistas.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-4">Campista</th>
                <th className="p-4">Idade</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Última Temp.</th>
                <th className="p-4">Saúde</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
              {paginatedCampistas.map((camper) => (
                <tr key={camper.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4">
                    <input
                      className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-transparent cursor-pointer"
                      type="checkbox"
                      checked={selectedIds.includes(camper.id)}
                      onChange={(e) => handleSelectOne(camper.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={camper.avatar} name={camper.name} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{camper.name}</span>
                        <span className="text-[10px] text-slate-400">ID: #{camper.id.padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{camper.age} anos</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-200 font-medium">{camper.parentName}</td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{camper.parentPhone}</td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{camper.lastSeason}</span>
                  </td>
                  <td className="p-4">
                    {camper.healthAlert ? (
                      <span className="material-symbols-outlined text-danger text-xl cursor-help" title="Alergia ou Medicação">medical_services</span>
                    ) : (
                      <span className="material-symbols-outlined text-success text-xl opacity-20">check_circle</span>
                    )}
                  </td>
                  <td className="p-4">
                    <StatusBadge variant={camper.status === 'Active' ? 'success' : 'secondary'}>
                      {camper.status === 'Active' ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => navigate(`/campistas/${camper.id}`)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                        title="Ver detalhes"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        onClick={() => openEditModal(camper)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-info/10 hover:text-info transition-all"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, item: camper })}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-danger/10 hover:text-danger transition-all"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCampistas.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                    Nenhum campista encontrado
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
          showingTo={Math.min(currentPage * itemsPerPage, filteredCampistas.length)}
          totalItems={filteredCampistas.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={setFilters}
        type="campers"
      />

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        itemName={deleteModal.item?.name || ''}
      />

      {/* Add/Edit Camper Modal */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, mode: 'add', camper: null })}
        title={formModal.mode === 'add' ? 'Adicionar Campista' : 'Editar Campista'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setFormModal({ open: false, mode: 'add', camper: null })}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleFormSubmit}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors shadow-lg shadow-primary/30"
            >
              {formModal.mode === 'add' ? 'Adicionar' : 'Salvar'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nome do Campista"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome completo"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Idade"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="0"
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
              >
                <option value="Active">Ativo</option>
                <option value="Inactive">Inativo</option>
              </select>
            </div>
          </div>
          <Input
            label="Nome do Responsável"
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            placeholder="Nome do pai/mãe"
            required
          />
          <Input
            label="Telefone do Responsável"
            value={formData.parentPhone}
            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
            placeholder="(00) 00000-0000"
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default CampistasView;
