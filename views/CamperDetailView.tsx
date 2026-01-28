
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Season, Camper } from '../types';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';

const MOCK_CAMPISTAS: Camper[] = [
    { id: '1', name: 'Jordan Stevenson', age: 12, lastSeason: Season.SUMMER_2024, parentName: 'Mary Stevenson', parentPhone: '(11) 98888-7777', status: 'Active', avatar: 'https://picsum.photos/seed/jordan/100', healthAlert: true },
    { id: '2', name: 'Richard Brown', age: 10, lastSeason: Season.WINTER_2024, parentName: 'John Brown', parentPhone: '(11) 97777-6666', status: 'Active' },
    { id: '3', name: 'Sarah Jenkins', age: 14, lastSeason: Season.SUMMER_2024, parentName: 'Alice Jenkins', parentPhone: '(11) 96666-5555', status: 'Inactive', avatar: 'https://picsum.photos/seed/sarah/100' },
    { id: '4', name: 'Bentlee Emblin', age: 9, lastSeason: Season.WINTER_2024, parentName: 'Robert Emblin', parentPhone: '(11) 95555-4444', status: 'Active', avatar: 'https://picsum.photos/seed/bentlee/100' },
    { id: '5', name: 'Benedicto Müller', age: 11, lastSeason: Season.SUMMER_2024, parentName: 'Greta Müller', parentPhone: '(11) 94444-3333', status: 'Active', healthAlert: true },
    { id: '6', name: 'Livia Costa', age: 13, lastSeason: Season.SUMMER_2026, parentName: 'Carlos Costa', parentPhone: '(11) 93333-2222', status: 'Active', avatar: 'https://picsum.photos/seed/livia/100' },
];

const CamperDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const camper = MOCK_CAMPISTAS.find(c => c.id === id);

    if (!camper) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-8 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">person_off</span>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Campista não encontrado</h2>
                    <p className="text-slate-500 mb-6">O campista que você está procurando não existe ou foi removido.</p>
                    <button
                        onClick={() => navigate('/campistas')}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all"
                    >
                        Voltar para Campistas
                    </button>
                </div>
            </div>
        );
    }

    const participationHistory = [
        { season: 'Verão 2026', status: 'Inscrito', paid: true },
        { season: 'Inverno 2024', status: 'Participou', paid: true },
        { season: 'Verão 2024', status: 'Participou', paid: true },
        { season: 'Verão 2023', status: 'Participou', paid: true },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/campistas')}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Detalhes do Campista</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary-hover h-24"></div>
                    <div className="px-6 pb-6">
                        <div className="-mt-12 mb-4">
                            <Avatar src={camper.avatar} name={camper.name} size="lg" className="w-24 h-24 text-2xl ring-4 ring-white dark:ring-surface-dark" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{camper.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">ID: #{camper.id.padStart(4, '0')}</p>

                        <div className="mt-4 flex items-center gap-2">
                            <StatusBadge variant={camper.status === 'Active' ? 'success' : 'secondary'}>
                                {camper.status === 'Active' ? 'Ativo' : 'Inativo'}
                            </StatusBadge>
                            {camper.healthAlert && (
                                <StatusBadge variant="danger">Alerta Saúde</StatusBadge>
                            )}
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">cake</span>
                                <span className="text-slate-600 dark:text-slate-300">{camper.age} anos</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                                <span className="text-slate-600 dark:text-slate-300">Última temp.: {camper.lastSeason}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-border-dark">
                            <button className="w-full py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all">
                                Editar Campista
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Parent Info */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">family_restroom</span>
                            Responsável
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Nome</p>
                                <p className="text-slate-800 dark:text-white font-medium">{camper.parentName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Telefone</p>
                                <p className="text-slate-800 dark:text-white font-medium">{camper.parentPhone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                                <p className="text-slate-800 dark:text-white font-medium">{camper.parentName.toLowerCase().replace(' ', '.')}@email.com</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">CPF</p>
                                <p className="text-slate-800 dark:text-white font-medium">***.***.***-**</p>
                            </div>
                        </div>
                    </div>

                    {/* Health Info */}
                    {camper.healthAlert && (
                        <div className="bg-danger/5 border border-danger/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-danger mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">medical_services</span>
                                Informações de Saúde
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-danger text-lg mt-0.5">warning</span>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white">Alergia a Amendoim</p>
                                        <p className="text-sm text-slate-500">Evitar qualquer alimento que contenha amendoim ou derivados.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-info text-lg mt-0.5">medication</span>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white">Medicação Contínua</p>
                                        <p className="text-sm text-slate-500">Tomar 1 comprimido de vitamina D após o café da manhã.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Participation History */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">history</span>
                            Histórico de Participação
                        </h3>
                        <div className="space-y-3">
                            {participationHistory.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">camping</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{item.season}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge variant={item.paid ? 'success' : 'warning'}>
                                            {item.paid ? 'Pago' : 'Pendente'}
                                        </StatusBadge>
                                        <StatusBadge variant="info">{item.status}</StatusBadge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CamperDetailView;
