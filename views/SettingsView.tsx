
import React, { useState, useEffect } from 'react';
import SettingsCard from '../components/SettingsCard';
import { supabase } from '../lib/supabase';

interface Season {
  id: string;
  name: string;
  status: 'active' | 'closed';
  created_at: string;
}

interface Period {
  id: string;
  label: string;
  start_date: string;
  end_date: string;
  season_id: string;
  season_name?: string;
}

const SettingsView: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [seasonModal, setSeasonModal] = useState<{ open: boolean; editing: Season | null }>({ open: false, editing: null });
  const [periodModal, setPeriodModal] = useState<{ open: boolean; editing: Period | null }>({ open: false, editing: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'season' | 'period'; item: any }>({ open: false, type: 'season', item: null });

  // Form states
  const [seasonForm, setSeasonForm] = useState({ name: '', status: 'active' as 'active' | 'closed' });
  const [periodForm, setPeriodForm] = useState({ label: '', start_date: '', end_date: '', season_id: '' });

  // Fetch data
  const fetchSeasons = async () => {
    const { data, error } = await supabase.from('seasons').select('*').order('created_at', { ascending: false });
    if (!error && data) setSeasons(data);
  };

  const fetchPeriods = async () => {
    const { data, error } = await supabase
      .from('periods')
      .select('*, seasons(name)')
      .order('start_date', { ascending: true });
    if (!error && data) {
      setPeriods(data.map((p: any) => ({ ...p, season_name: p.seasons?.name })));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSeasons(), fetchPeriods()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Season CRUD
  const openSeasonModal = (season?: Season) => {
    if (season) {
      setSeasonForm({ name: season.name, status: season.status });
      setSeasonModal({ open: true, editing: season });
    } else {
      setSeasonForm({ name: '', status: 'active' });
      setSeasonModal({ open: true, editing: null });
    }
  };

  const saveSeason = async () => {
    if (seasonModal.editing) {
      await supabase.from('seasons').update(seasonForm).eq('id', seasonModal.editing.id);
    } else {
      await supabase.from('seasons').insert(seasonForm);
    }
    setSeasonModal({ open: false, editing: null });
    fetchSeasons();
  };

  const deleteSeason = async (id: string) => {
    await supabase.from('seasons').delete().eq('id', id);
    setDeleteModal({ open: false, type: 'season', item: null });
    fetchSeasons();
  };

  // Period CRUD
  const openPeriodModal = (period?: Period) => {
    if (period) {
      setPeriodForm({
        label: period.label,
        start_date: period.start_date,
        end_date: period.end_date,
        season_id: period.season_id
      });
      setPeriodModal({ open: true, editing: period });
    } else {
      setPeriodForm({ label: '', start_date: '', end_date: '', season_id: seasons[0]?.id || '' });
      setPeriodModal({ open: true, editing: null });
    }
  };

  const savePeriod = async () => {
    if (periodModal.editing) {
      await supabase.from('periods').update(periodForm).eq('id', periodModal.editing.id);
    } else {
      await supabase.from('periods').insert(periodForm);
    }
    setPeriodModal({ open: false, editing: null });
    fetchPeriods();
  };

  const deletePeriod = async (id: string) => {
    await supabase.from('periods').delete().eq('id', id);
    setDeleteModal({ open: false, type: 'period', item: null });
    fetchPeriods();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Adicionar T00:00:00 para interpretar como horário local, não UTC
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configurações do Sistema</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie as regras de negócio, períodos e precificação do acampamento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card: Temporadas */}
        <SettingsCard title="Temporadas" icon="calendar_month" onAdd={() => openSeasonModal()}>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : seasons.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Nenhuma temporada cadastrada</p>
            ) : (
              seasons.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-border-dark">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.name}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'active' ? 'text-success' : 'text-secondary'}`}>
                      {item.status === 'active' ? 'Ativa' : 'Encerrada'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openSeasonModal(item)} className="p-1 text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, type: 'season', item })} className="p-1 text-slate-400 hover:text-danger transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => openSeasonModal()}
            className="w-full mt-6 py-2 px-4 border border-dashed border-primary/40 text-primary text-sm font-semibold rounded-lg hover:bg-primary/5 transition-all"
          >
            Criar Nova Temporada
          </button>
        </SettingsCard>

        {/* Card: Períodos */}
        <SettingsCard title="Períodos" icon="schedule" onAdd={() => openPeriodModal()}>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : periods.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Nenhum período cadastrado</p>
            ) : (
              periods.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border-l-4 border-primary bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      {formatDate(item.start_date)} - {formatDate(item.end_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-medium text-slate-400 uppercase">{item.season_name}</p>
                    <button onClick={() => openPeriodModal(item)} className="p-1 text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, type: 'period', item })} className="p-1 text-slate-400 hover:text-danger transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => openPeriodModal()}
            className="w-full mt-6 py-2 px-4 border border-dashed border-primary/40 text-primary text-sm font-semibold rounded-lg hover:bg-primary/5 transition-all"
          >
            Criar Novo Período
          </button>
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-primary">Dica:</span> Os períodos definem as datas de check-in e check-out disponíveis na ficha de inscrição.
            </p>
          </div>
        </SettingsCard>

        {/* Card: Valores */}
        <SettingsCard title="Valores e Taxas" icon="attach_money" onAdd={() => { }}>
          <div className="space-y-3">
            {[
              { item: 'Inscrição Regular', price: 'R$ 1.200,00' },
              { item: 'Inscrição Early Bird', price: 'R$ 950,00' },
              { item: 'Taxa de Kart', price: 'R$ 150,00' },
              { item: 'Kit Camiseta', price: 'R$ 85,00' },
              { item: 'Seguro Adicional', price: 'R$ 45,00' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-border-dark last:border-0">
                <span className="text-sm text-slate-600 dark:text-slate-300">{item.item}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{item.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Métodos de Pagamento</h4>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">PIX</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">CARTÃO</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">BOLETO</span>
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* Opções Gerais Adicionais */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-border-dark rounded-lg">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notificações por Email</p>
              <p className="text-xs text-slate-400">Avisar pais sobre aprovação</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-border-dark rounded-lg">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Inscrições Abertas</p>
              <p className="text-xs text-slate-400">Permitir novos registros</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-border-dark rounded-lg">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Modo de Manutenção</p>
              <p className="text-xs text-slate-400">Bloquear acesso staff</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Season Modal */}
      {seasonModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 dark:border-border-dark">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {seasonModal.editing ? 'Editar Temporada' : 'Nova Temporada'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome</label>
                <input
                  type="text"
                  value={seasonForm.name}
                  onChange={(e) => setSeasonForm({ ...seasonForm, name: e.target.value })}
                  placeholder="Ex: Verão 2026"
                  className="w-full rounded-lg border-gray-300 dark:border-border-dark dark:bg-slate-800 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={seasonForm.status}
                  onChange={(e) => setSeasonForm({ ...seasonForm, status: e.target.value as 'active' | 'closed' })}
                  className="w-full rounded-lg border-gray-300 dark:border-border-dark dark:bg-slate-800 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                >
                  <option value="active">Ativa</option>
                  <option value="closed">Encerrada</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-border-dark flex justify-end gap-3">
              <button
                onClick={() => setSeasonModal({ open: false, editing: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveSeason}
                disabled={!seasonForm.name}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50"
              >
                {seasonModal.editing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Period Modal */}
      {periodModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 dark:border-border-dark">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {periodModal.editing ? 'Editar Período' : 'Novo Período'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Período</label>
                <input
                  type="text"
                  value={periodForm.label}
                  onChange={(e) => setPeriodForm({ ...periodForm, label: e.target.value })}
                  placeholder="Ex: Semana 1"
                  className="w-full rounded-lg border-gray-300 dark:border-border-dark dark:bg-slate-800 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temporada</label>
                <select
                  value={periodForm.season_id}
                  onChange={(e) => setPeriodForm({ ...periodForm, season_id: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-border-dark dark:bg-slate-800 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                >
                  <option value="">Selecione uma temporada</option>
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={periodForm.start_date}
                    onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-border-dark dark:bg-slate-800 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={periodForm.end_date}
                    onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-border-dark dark:bg-slate-800 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-border-dark flex justify-end gap-3">
              <button
                onClick={() => setPeriodModal({ open: false, editing: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={savePeriod}
                disabled={!periodForm.label || !periodForm.season_id || !periodForm.start_date || !periodForm.end_date}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50"
              >
                {periodModal.editing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-danger">warning</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tem certeza que deseja excluir {deleteModal.type === 'season' ? 'a temporada' : 'o período'} <strong>{deleteModal.item?.name || deleteModal.item?.label}</strong>?
              </p>
              {deleteModal.type === 'season' && (
                <p className="mt-4 p-2 bg-danger/10 text-[11px] text-danger font-bold rounded border border-danger/20">
                  AVISO: Isso também excluirá todos os períodos associados a esta temporada.
                </p>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-border-dark flex justify-center gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, type: 'season', item: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteModal.type === 'season' ? deleteSeason(deleteModal.item.id) : deletePeriod(deleteModal.item.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-danger hover:bg-red-600 rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
