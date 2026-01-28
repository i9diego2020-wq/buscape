
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';

interface Registration {
    id: string;
    created_at: string;
    season: string;
    period: string | null;
    options: string[];
    child_name: string;
    child_birth_date: string | null;
    child_age: number | null;
    child_rg: string | null;
    child_school_grade: string | null;
    address_cep: string | null;
    address_street: string | null;
    address_number: string | null;
    address_neighborhood: string | null;
    address_city: string | null;
    mother_name: string | null;
    mother_workplace: string | null;
    mother_cpf: string | null;
    mother_phone: string | null;
    mother_email: string | null;
    father_name: string | null;
    father_workplace: string | null;
    father_cpf: string | null;
    father_phone: string | null;
    father_email: string | null;
    emergency_contact_name: string | null;
    emergency_contact_relation: string | null;
    emergency_contact_phone: string | null;
    emergency_contact_phone_secondary: string | null;
    parents_absent: boolean | null;
    authorize_third_party: boolean | null;
    authorized_person_name: string | null;
    can_swim: boolean | null;
    will_use_floats: boolean | null;
    signature_location: string | null;
    signature_date: string | null;
    signature_data: string | null;
    payment_amount: number | null;
    status: string;
}

const RegistrationDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [registration, setRegistration] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegistration = async () => {
            if (!id) return;

            try {
                const { data, error: fetchError } = await supabase
                    .from('registrations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fetchError) throw fetchError;
                setRegistration(data);
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar inscrição');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistration();
    }, [id]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('pt-BR');
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

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !registration) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-8 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">person_off</span>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Inscrição não encontrada</h2>
                    <p className="text-slate-500 mb-6">{error || 'A inscrição que você está procurando não existe.'}</p>
                    <button
                        onClick={() => navigate('/inscricoes')}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all"
                    >
                        Voltar para Inscrições
                    </button>
                </div>
            </div>
        );
    }

    const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-slate-800 dark:text-white font-medium">{value || '-'}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/inscricoes')}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Detalhes da Inscrição</h1>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                    <span className="material-symbols-outlined text-lg">print</span>
                    Imprimir
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card - Coluna Esquerda */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary-hover h-24"></div>
                    <div className="px-6 pb-6">
                        <div className="-mt-12 mb-4">
                            <Avatar name={registration.child_name} size="lg" className="w-24 h-24 text-2xl ring-4 ring-white dark:ring-surface-dark" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{registration.child_name}</h2>

                        <div className="mt-4 flex items-center gap-2">
                            <StatusBadge variant={getStatusVariant(registration.status)}>
                                {getStatusLabel(registration.status)}
                            </StatusBadge>
                            {registration.signature_data && (
                                <StatusBadge variant="info">Assinado</StatusBadge>
                            )}
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">event</span>
                                <div>
                                    <span className="text-xs text-slate-400">Nascimento</span>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{formatDate(registration.child_birth_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">cake</span>
                                <span className="text-slate-600 dark:text-slate-300">{registration.child_age ? `${registration.child_age} anos` : '-'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">badge</span>
                                <div>
                                    <span className="text-xs text-slate-400">RG</span>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{registration.child_rg || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">school</span>
                                <div>
                                    <span className="text-xs text-slate-400">Série Escolar</span>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{registration.child_school_grade || '-'}</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-slate-100 dark:border-border-dark flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                                <span className="text-slate-600 dark:text-slate-300">{registration.season}</span>
                            </div>
                            {registration.period && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
                                    <span className="text-slate-600 dark:text-slate-300">{registration.period}</span>
                                </div>
                            )}
                        </div>

                        {/* Opções */}
                        {registration.options && registration.options.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-border-dark">
                                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Opções</p>
                                <div className="flex flex-wrap gap-2">
                                    {registration.options.map((opt, i) => (
                                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                                            {opt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-border-dark">
                            <p className="text-xs text-slate-400">
                                Inscrito em: {new Date(registration.created_at).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Cards - Coluna Central e Direita */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dados da Mãe */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-pink-500">female</span>
                            Dados da Mãe
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="Nome" value={registration.mother_name} />
                            <InfoItem label="Onde Trabalha" value={registration.mother_workplace} />
                            <InfoItem label="CPF" value={registration.mother_cpf} />
                            <InfoItem label="Telefone" value={registration.mother_phone} />
                            <div className="md:col-span-2">
                                <InfoItem label="Email" value={registration.mother_email} />
                            </div>
                        </div>
                    </div>

                    {/* Dados do Pai */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">male</span>
                            Dados do Pai
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="Nome" value={registration.father_name} />
                            <InfoItem label="Onde Trabalha" value={registration.father_workplace} />
                            <InfoItem label="CPF" value={registration.father_cpf} />
                            <InfoItem label="Telefone" value={registration.father_phone} />
                            <div className="md:col-span-2">
                                <InfoItem label="Email" value={registration.father_email} />
                            </div>
                        </div>
                    </div>

                    {/* Contato de Emergência */}
                    <div className="bg-danger/5 border border-danger/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-danger mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">emergency</span>
                            Contato de Emergência
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="Nome" value={registration.emergency_contact_name} />
                            <InfoItem label="Parentesco" value={registration.emergency_contact_relation} />
                            <InfoItem label="Telefone Principal" value={registration.emergency_contact_phone} />
                            <InfoItem label="Telefone Secundário" value={registration.emergency_contact_phone_secondary} />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">home</span>
                            Endereço
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="CEP" value={registration.address_cep} />
                            <InfoItem label="Cidade" value={registration.address_city} />
                            <InfoItem label="Rua" value={registration.address_street} />
                            <InfoItem label="Número" value={registration.address_number} />
                            <InfoItem label="Bairro" value={registration.address_neighborhood} />
                        </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            Informações Adicionais
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                                <p className="text-xs text-slate-500 mb-1">Sabe Nadar?</p>
                                <span className={`material-symbols-outlined text-2xl ${registration.can_swim ? 'text-success' : 'text-danger'}`}>
                                    {registration.can_swim ? 'check_circle' : 'cancel'}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                                <p className="text-xs text-slate-500 mb-1">Usará Boias?</p>
                                <span className={`material-symbols-outlined text-2xl ${registration.will_use_floats ? 'text-success' : 'text-slate-300'}`}>
                                    {registration.will_use_floats ? 'check_circle' : 'remove_circle'}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                                <p className="text-xs text-slate-500 mb-1">Pais Ausentes?</p>
                                <span className={`material-symbols-outlined text-2xl ${registration.parents_absent ? 'text-warning' : 'text-slate-300'}`}>
                                    {registration.parents_absent ? 'warning' : 'home'}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center flex flex-col items-center justify-center">
                                <p className="text-xs text-slate-500 mb-1">Autoriza Terceiros?</p>
                                <span className={`material-symbols-outlined text-2xl ${registration.authorize_third_party ? 'text-success' : 'text-danger'}`}>
                                    {registration.authorize_third_party ? 'check_circle' : 'cancel'}
                                </span>
                                {registration.authorize_third_party && registration.authorized_person_name && (
                                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 w-full">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Autorizado:</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold break-words">
                                            {registration.authorized_person_name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Assinatura do Responsável */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">draw</span>
                            Assinatura do Responsável
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <InfoItem label="Local" value={registration.signature_location} />
                            <InfoItem label="Data" value={formatDate(registration.signature_date)} />
                        </div>

                        {registration.signature_data ? (
                            <div className="bg-white border-2 border-slate-200 dark:border-border-dark rounded-lg p-6 text-center">
                                <img
                                    src={registration.signature_data}
                                    alt="Assinatura do Responsável"
                                    className="max-w-full h-auto mx-auto"
                                    style={{ maxHeight: '120px' }}
                                />
                                <p className="text-xs text-success mt-3 font-medium flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    Assinatura registrada digitalmente
                                </p>
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-8 text-center border-2 border-dashed border-slate-200 dark:border-border-dark">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">signature</span>
                                <p className="text-sm text-slate-500">Nenhuma assinatura registrada</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationDetailView;
