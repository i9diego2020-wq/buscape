import React, { useState } from 'react';
import Modal from './Modal';
import { RegistrationStatus, Season } from '../types';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterValues) => void;
    type: 'registrations' | 'campers';
}

export interface FilterValues {
    status?: string;
    season?: string;
    dateFrom?: string;
    dateTo?: string;
    ageMin?: number;
    ageMax?: number;
}

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    onApply,
    type,
}) => {
    const [filters, setFilters] = useState<FilterValues>({});

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        setFilters({});
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Filtros Avançados"
            size="md"
            footer={
                <>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                        Limpar
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors shadow-lg shadow-primary/30"
                    >
                        Aplicar Filtros
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                {type === 'registrations' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Status
                            </label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                            >
                                <option value="">Todos</option>
                                <option value={RegistrationStatus.APPROVED}>Aprovado</option>
                                <option value={RegistrationStatus.PENDING}>Pendente</option>
                                <option value={RegistrationStatus.REJECTED}>Rejeitado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Temporada
                            </label>
                            <select
                                value={filters.season || ''}
                                onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                            >
                                <option value="">Todas</option>
                                <option value={Season.SUMMER_2026}>Verão 2026</option>
                                <option value={Season.WINTER_2026}>Inverno 2026</option>
                                <option value={Season.SUMMER_2024}>Verão 2024</option>
                                <option value={Season.WINTER_2024}>Inverno 2024</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Data Início
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateFrom || ''}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Data Fim
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateTo || ''}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                                />
                            </div>
                        </div>
                    </>
                )}

                {type === 'campers' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Status
                            </label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                            >
                                <option value="">Todos</option>
                                <option value="Active">Ativo</option>
                                <option value="Inactive">Inativo</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Idade Mínima
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="18"
                                    value={filters.ageMin || ''}
                                    onChange={(e) => setFilters({ ...filters, ageMin: Number(e.target.value) })}
                                    className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Idade Máxima
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="18"
                                    value={filters.ageMax || ''}
                                    onChange={(e) => setFilters({ ...filters, ageMax: Number(e.target.value) })}
                                    className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Última Temporada
                            </label>
                            <select
                                value={filters.season || ''}
                                onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                            >
                                <option value="">Todas</option>
                                <option value={Season.SUMMER_2026}>Verão 2026</option>
                                <option value={Season.WINTER_2026}>Inverno 2026</option>
                                <option value={Season.SUMMER_2024}>Verão 2024</option>
                                <option value={Season.WINTER_2024}>Inverno 2024</option>
                            </select>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default FilterModal;
