
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import SignaturePad from '../components/SignaturePad';

interface FormData {
    // Opções iniciais
    options: string[];

    // Dados da criança
    childName: string;
    childBirthDate: string;
    childAge: string;
    childRg: string;
    childSchoolGrade: string;

    // Endereço
    addressCep: string;
    addressStreet: string;
    addressNumber: string;
    addressNeighborhood: string;
    addressCity: string;

    // Dados da mãe
    motherName: string;
    motherWorkplace: string;
    motherCpf: string;
    motherPhone: string;
    motherEmail: string;

    // Dados do pai
    fatherName: string;
    fatherWorkplace: string;
    fatherCpf: string;
    fatherPhone: string;
    fatherEmail: string;

    // Contato de emergência
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactPhone: string;
    emergencyContactPhoneSecondary: string;

    // Informações adicionais
    parentsAbsent: string;
    authorizeThirdParty: string;
    authorizedPersonName: string;

    // Saúde/Segurança
    canSwim: string;
    willUseFloats: string;

    // Temporada
    season: string;
    period: string;

    // Assinatura
    signatureLocation: string;
    signatureDate: string;
    signatureData: string;
}

const initialFormData: FormData = {
    options: ['Embarque ABC'],
    childName: '',
    childBirthDate: '',
    childAge: '',
    childRg: '',
    childSchoolGrade: '',
    addressCep: '',
    addressStreet: '',
    addressNumber: '',
    addressNeighborhood: '',
    addressCity: '',
    motherName: '',
    motherWorkplace: '',
    motherCpf: '',
    motherPhone: '',
    motherEmail: '',
    fatherName: '',
    fatherWorkplace: '',
    fatherCpf: '',
    fatherPhone: '',
    fatherEmail: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactPhoneSecondary: '',
    parentsAbsent: '',
    authorizeThirdParty: '',
    authorizedPersonName: '',
    canSwim: '',
    willUseFloats: '',
    season: '',
    period: '',
    signatureLocation: 'São Paulo',
    signatureDate: new Date().toISOString().split('T')[0],
    signatureData: '',
};

const availableOptions = ['Embarque ABC', 'Embarque SP', 'Direto p/ Bragança', 'Camiseta', 'Kart', 'Parque Radical', 'Agasalho'];

const PublicRegistrationView: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);

    // Estados para temporadas e períodos do banco
    const [seasons, setSeasons] = useState<{ id: string; name: string; status: string }[]>([]);
    const [periods, setPeriods] = useState<{ id: string; label: string; start_date: string; end_date: string; season_id: string }[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    // Buscar temporadas e períodos ao carregar
    React.useEffect(() => {
        const fetchOptions = async () => {
            setLoadingOptions(true);
            try {
                // Buscar apenas temporadas ativas
                const { data: seasonsData } = await supabase
                    .from('seasons')
                    .select('*')
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                const { data: periodsData } = await supabase
                    .from('periods')
                    .select('*')
                    .order('start_date', { ascending: true });

                if (seasonsData) setSeasons(seasonsData);
                if (periodsData) setPeriods(periodsData);
            } catch (err) {
                console.error('Erro ao carregar opções:', err);
            } finally {
                setLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    // Função para formatar telefone no padrão (11) 22222-2222
    const formatPhone = (value: string): string => {
        const numbers = value.replace(/\D/g, '').slice(0, 11);
        if (numbers.length === 0) return '';
        if (numbers.length <= 2) return `(${numbers}`;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    };

    // Handler específico para campos de telefone
    const handlePhoneChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: formatPhone(value) }));
    };

    // Função para formatar CPF no padrão 111.111.111-11
    const formatCpf = (value: string): string => {
        const numbers = value.replace(/\D/g, '').slice(0, 11);
        if (numbers.length === 0) return '';
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
        if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
    };

    // Handler específico para campos de CPF
    const handleCpfChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: formatCpf(value) }));
    };

    // Estado e funções para autocomplete de email
    const [emailSuggestions, setEmailSuggestions] = useState<{ field: keyof FormData; suggestions: string[] }>({ field: 'motherEmail', suggestions: [] });
    const emailDomains = ['@gmail.com', '@hotmail.com', '@outlook.com', '@yahoo.com', '@icloud.com', '@live.com'];

    const handleEmailChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Mostrar sugestões se tiver @ mas não tiver domínio completo
        if (value.includes('@') && !value.includes('.com') && !value.includes('.br')) {
            const [localPart] = value.split('@');
            const partialDomain = value.split('@')[1] || '';
            const filteredDomains = emailDomains.filter(d => d.toLowerCase().includes(partialDomain.toLowerCase()));
            const suggestions = filteredDomains.map(d => localPart + d);
            setEmailSuggestions({ field, suggestions });
        } else if (!value.includes('@') && value.length > 3) {
            // Sugerir domínios comuns
            const suggestions = emailDomains.slice(0, 4).map(d => value + d);
            setEmailSuggestions({ field, suggestions });
        } else {
            setEmailSuggestions({ field, suggestions: [] });
        }
    };

    const selectEmailSuggestion = (field: keyof FormData, email: string) => {
        setFormData(prev => ({ ...prev, [field]: email }));
        setEmailSuggestions({ field, suggestions: [] });
    };

    // Função para buscar endereço pelo CEP
    const fetchAddressByCep = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    addressStreet: data.logradouro || '',
                    addressNeighborhood: data.bairro || '',
                    addressCity: `${data.localidade}/${data.uf}` || '',
                }));
            }
        } catch (err) {
            console.error('Erro ao buscar CEP:', err);
        } finally {
            setLoadingCep(false);
        }
    };

    // Handler para CEP com formatação
    const handleCepChange = (value: string) => {
        const numbers = value.replace(/\D/g, '').slice(0, 8);
        let formatted = numbers;
        if (numbers.length > 5) {
            formatted = `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
        }
        setFormData(prev => ({ ...prev, addressCep: formatted }));

        if (numbers.length === 8) {
            fetchAddressByCep(numbers);
        }
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOptionToggle = (option: string) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.includes(option)
                ? prev.options.filter(o => o !== option)
                : [...prev.options, option]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const { error: insertError } = await supabase.from('registrations').insert({
                season: formData.season || 'Verão 2026',
                period: formData.period || null,
                options: formData.options,
                child_name: formData.childName,
                child_birth_date: formData.childBirthDate || null,
                child_age: formData.childAge ? parseInt(formData.childAge) : null,
                child_rg: formData.childRg || null,
                child_school_grade: formData.childSchoolGrade || null,
                address_cep: formData.addressCep || null,
                address_street: formData.addressStreet || null,
                address_number: formData.addressNumber || null,
                address_neighborhood: formData.addressNeighborhood || null,
                address_city: formData.addressCity || null,
                mother_name: formData.motherName || null,
                mother_workplace: formData.motherWorkplace || null,
                mother_cpf: formData.motherCpf || null,
                mother_phone: formData.motherPhone || null,
                mother_email: formData.motherEmail || null,
                father_name: formData.fatherName || null,
                father_workplace: formData.fatherWorkplace || null,
                father_cpf: formData.fatherCpf || null,
                father_phone: formData.fatherPhone || null,
                father_email: formData.fatherEmail || null,
                emergency_contact_name: formData.emergencyContactName || null,
                emergency_contact_relation: formData.emergencyContactRelation || null,
                emergency_contact_phone: formData.emergencyContactPhone || null,
                emergency_contact_phone_secondary: formData.emergencyContactPhoneSecondary || null,
                parents_absent: formData.parentsAbsent === 'Sim' ? true : formData.parentsAbsent === 'Não' ? false : null,
                authorize_third_party: formData.authorizeThirdParty === 'Sim' ? true : formData.authorizeThirdParty === 'Não' ? false : null,
                authorized_person_name: formData.authorizedPersonName || null,
                can_swim: formData.canSwim === 'Sim' ? true : formData.canSwim === 'Não' ? false : null,
                will_use_floats: formData.willUseFloats === 'Sim' ? true : formData.willUseFloats === 'Não' ? false : null,
                signature_location: formData.signatureLocation || null,
                signature_date: formData.signatureDate || null,
                signature_data: formData.signatureData || null,
                payment_amount: 350.00,
            });

            if (insertError) throw insertError;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar inscrição. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };


    if (success) {
        return (
            <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Confetes Explosão */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {[...Array(250)].map((_, i) => {
                        const angle = (i / 250) * 360 + Math.random() * 20;
                        const distance = 40 + Math.random() * 60;
                        const size = Math.random() * 15 + 8;
                        const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'];
                        return (
                            <div
                                key={i}
                                className="absolute confetti-particle"
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                                    borderRadius: Math.random() > 0.5 ? '50%' : '3px',
                                    '--angle': `${angle}deg`,
                                    '--distance': `${distance}vmin`,
                                    animationDelay: `${Math.random() * 0.5}s`,
                                    animationDuration: `${7 + Math.random() * 2}s`,
                                } as React.CSSProperties}
                            />
                        );
                    })}
                </div>
                <style>{`
                    @keyframes confetti-explode {
                        0% {
                            transform: translate(0, 0) rotate(0deg) scale(1);
                            opacity: 1;
                        }
                        70% {
                            opacity: 1;
                        }
                        100% {
                            transform: translate(
                                calc(cos(var(--angle)) * var(--distance)),
                                calc(sin(var(--angle)) * var(--distance))
                            ) rotate(1080deg) scale(0.3);
                            opacity: 0;
                        }
                    }
                    .confetti-particle {
                        animation: confetti-explode ease-out forwards;
                    }
                `}</style>
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center relative z-10">
                    <div className="bg-green-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center animate-bounce">
                        <span className="material-symbols-outlined text-green-600 text-4xl">celebration</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Inscrição Enviada!</h1>
                    <p className="text-gray-600 mb-8">
                        Recebemos a inscrição de <strong className="text-gray-800">{formData.childName}</strong>.
                        <br />Entraremos em contato em breve pelo telefone ou email cadastrado.
                    </p>
                    <button
                        onClick={() => { setSuccess(false); setFormData(initialFormData); }}
                        className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
                    >
                        Fazer Nova Inscrição
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EFF6FF] flex flex-col" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            {/* Header */}
            <header className="w-full bg-white border-b border-blue-100 py-8 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-blue-100 p-3 rounded-full text-[#2563EB]">
                            <span className="material-symbols-outlined text-4xl">camping</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Acampamento Buscapé</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-[#2563EB] mb-3">Ficha de Inscrição - Temporada 2026</h2>
                    <p className="text-[#64748B] max-w-2xl mx-auto text-base leading-relaxed">
                        Bem-vindo à nossa página de inscrição! Preencha o formulário abaixo com os dados do campista e dos responsáveis.
                        Sua segurança e diversão são nossa prioridade.
                    </p>
                </div>
            </header>

            {/* Main */}
            <main className="flex-grow py-10 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Opções Iniciais */}
                        <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                            <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#2563EB]">settings</span>
                                    Opções Iniciais
                                </h3>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {availableOptions.map((option) => (
                                        <label key={option} className="cursor-pointer relative group">
                                            <input
                                                className="peer sr-only"
                                                type="checkbox"
                                                checked={formData.options.includes(option)}
                                                onChange={() => handleOptionToggle(option)}
                                            />
                                            <div className="h-full flex items-center justify-center rounded-lg border border-gray-200 px-3 py-3 text-center text-sm font-medium text-gray-600 peer-checked:border-[#2563EB] peer-checked:bg-blue-50 peer-checked:text-[#2563EB] transition-all hover:border-blue-300">
                                                {option}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Dados da Criança */}
                        <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                            <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#2563EB]">face</span>
                                    Dados da Criança
                                </h3>
                            </div>
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            placeholder="Nome do campista"
                                            type="text"
                                            required
                                            value={formData.childName}
                                            onChange={(e) => handleChange('childName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de nascimento *</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="date"
                                            required
                                            value={formData.childBirthDate}
                                            onChange={(e) => handleChange('childBirthDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Idade</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            placeholder="Ex: 10"
                                            type="number"
                                            value={formData.childAge}
                                            onChange={(e) => handleChange('childAge', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">RG</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.childRg}
                                            onChange={(e) => handleChange('childRg', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Série escolar</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.childSchoolGrade}
                                            onChange={(e) => handleChange('childSchoolGrade', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Endereço */}
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Endereço</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">CEP</label>
                                            <div className="relative">
                                                <input
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                    type="text"
                                                    placeholder="00000-000"
                                                    value={formData.addressCep}
                                                    onChange={(e) => handleCepChange(e.target.value)}
                                                />
                                                {loadingCep && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <div className="animate-spin h-5 w-5 border-2 border-[#2563EB] border-t-transparent rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Digite o CEP para preencher o endereço automaticamente</p>
                                        </div>
                                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço</label>
                                                <input
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                    type="text"
                                                    value={formData.addressStreet}
                                                    onChange={(e) => handleChange('addressStreet', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Número</label>
                                                <input
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                    type="text"
                                                    value={formData.addressNumber}
                                                    onChange={(e) => handleChange('addressNumber', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bairro</label>
                                            <input
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                type="text"
                                                value={formData.addressNeighborhood}
                                                onChange={(e) => handleChange('addressNeighborhood', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade</label>
                                            <input
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                type="text"
                                                value={formData.addressCity}
                                                onChange={(e) => handleChange('addressCity', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Dados dos Pais */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Mãe */}
                            <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                                <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#2563EB]">female</span>
                                        Dados da Mãe
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da mãe</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.motherName}
                                            onChange={(e) => handleChange('motherName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Onde trabalha</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.motherWorkplace}
                                            onChange={(e) => handleChange('motherWorkplace', e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="email"
                                            placeholder="exemplo@gmail.com"
                                            value={formData.motherEmail}
                                            onChange={(e) => handleEmailChange('motherEmail', e.target.value)}
                                            onBlur={() => setTimeout(() => setEmailSuggestions({ field: 'motherEmail', suggestions: [] }), 200)}
                                        />
                                        {emailSuggestions.field === 'motherEmail' && emailSuggestions.suggestions.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                {emailSuggestions.suggestions.map((suggestion, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                        onClick={() => selectEmailSuggestion('motherEmail', suggestion)}
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
                                            <input
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                type="text"
                                                placeholder="000.000.000-00"
                                                value={formData.motherCpf}
                                                onChange={(e) => handleCpfChange('motherCpf', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                                            <input
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                type="text"
                                                placeholder="(11) 99999-9999"
                                                value={formData.motherPhone}
                                                onChange={(e) => handlePhoneChange('motherPhone', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Pai */}
                            <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                                <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#2563EB]">male</span>
                                        Dados do Pai
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do pai</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.fatherName}
                                            onChange={(e) => handleChange('fatherName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Onde trabalha</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.fatherWorkplace}
                                            onChange={(e) => handleChange('fatherWorkplace', e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="email"
                                            placeholder="exemplo@gmail.com"
                                            value={formData.fatherEmail}
                                            onChange={(e) => handleEmailChange('fatherEmail', e.target.value)}
                                            onBlur={() => setTimeout(() => setEmailSuggestions({ field: 'fatherEmail', suggestions: [] }), 200)}
                                        />
                                        {emailSuggestions.field === 'fatherEmail' && emailSuggestions.suggestions.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                {emailSuggestions.suggestions.map((suggestion, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                        onClick={() => selectEmailSuggestion('fatherEmail', suggestion)}
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
                                            <input
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                type="text"
                                                placeholder="000.000.000-00"
                                                value={formData.fatherCpf}
                                                onChange={(e) => handleCpfChange('fatherCpf', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                                            <input
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                type="text"
                                                placeholder="(11) 99999-9999"
                                                value={formData.fatherPhone}
                                                onChange={(e) => handlePhoneChange('fatherPhone', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Contato de Emergência */}
                        <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                            <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#2563EB]">emergency</span>
                                    Contato de Emergência
                                </h3>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do contato <span className="text-red-500">*</span></label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            required
                                            value={formData.emergencyContactName}
                                            onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Grau de parentesco</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.emergencyContactRelation}
                                            onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone principal <span className="text-red-500">*</span></label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            required
                                            placeholder="(11) 99999-9999"
                                            value={formData.emergencyContactPhone}
                                            onChange={(e) => handlePhoneChange('emergencyContactPhone', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone secundário (opcional)</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            placeholder="(11) 99999-9999"
                                            value={formData.emergencyContactPhoneSecondary}
                                            onChange={(e) => handlePhoneChange('emergencyContactPhoneSecondary', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Informações Adicionais e Saúde */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Informações Adicionais */}
                            <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                                <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#2563EB]">info</span>
                                        Informações Adicionais
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Os pais estarão ausentes?</label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            value={formData.parentsAbsent}
                                            onChange={(e) => handleChange('parentsAbsent', e.target.value)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Autoriza terceiros no embarque?</label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            value={formData.authorizeThirdParty}
                                            onChange={(e) => handleChange('authorizeThirdParty', e.target.value)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                    </div>
                                    {formData.authorizeThirdParty === 'Sim' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da pessoa autorizada <span className="text-red-500">*</span></label>
                                            <input
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                                type="text"
                                                required
                                                placeholder="Nome completo da pessoa autorizada"
                                                value={formData.authorizedPersonName}
                                                onChange={(e) => handleChange('authorizedPersonName', e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Saúde/Segurança */}
                            <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                                <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#2563EB]">medical_services</span>
                                        Saúde / Segurança
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sabe nadar?</label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            value={formData.canSwim}
                                            onChange={(e) => handleChange('canSwim', e.target.value)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Usará boias?</label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            value={formData.willUseFloats}
                                            onChange={(e) => handleChange('willUseFloats', e.target.value)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                        {formData.willUseFloats === 'Sim' && (
                                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">info</span>
                                                Em caso afirmativo, os pais deverão providenciar as boias para seu filho.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Seleção de Temporada */}
                        <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                            <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#2563EB]">calendar_month</span>
                                    Seleção de Temporada
                                </h3>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Temporada <span className="text-red-500">*</span></label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            required
                                            value={formData.season}
                                            onChange={(e) => {
                                                handleChange('season', e.target.value);
                                                handleChange('period', ''); // Limpar período ao trocar temporada
                                            }}
                                            disabled={loadingOptions}
                                        >
                                            <option value="">{loadingOptions ? 'Carregando...' : 'Selecione a temporada'}</option>
                                            {seasons.map((season) => (
                                                <option key={season.id} value={season.name}>{season.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Período <span className="text-red-500">*</span></label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            required
                                            value={formData.period}
                                            onChange={(e) => handleChange('period', e.target.value)}
                                            disabled={loadingOptions || !formData.season}
                                        >
                                            <option value="">{!formData.season ? 'Selecione a temporada primeiro' : 'Selecione o período'}</option>
                                            {periods
                                                .filter((p) => {
                                                    const selectedSeason = seasons.find(s => s.name === formData.season);
                                                    return selectedSeason ? p.season_id === selectedSeason.id : false;
                                                })
                                                .map((period) => {
                                                    // Adicionar T00:00:00 para interpretar como horário local, não UTC
                                                    const startDate = new Date(period.start_date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                                    const endDate = new Date(period.end_date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                                    return (
                                                        <option key={period.id} value={period.label}>
                                                            {period.label} ({startDate} - {endDate})
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Assinatura */}
                        <section className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                            <div className="border-b border-[#E2E8F0] bg-gray-50/50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#2563EB]">draw</span>
                                    Assinatura do Responsável
                                </h3>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="bg-blue-50/50 rounded-lg p-4 mb-6 border border-blue-100">
                                    <p className="text-sm text-gray-700">
                                        Declaro que autorizo a participação do menor nas atividades do Acampamento Buscapé, estando ciente das normas e condições estabelecidas.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Local</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="text"
                                            value={formData.signatureLocation}
                                            onChange={(e) => handleChange('signatureLocation', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Data</label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2563EB] focus:ring-[#2563EB] text-gray-900"
                                            type="date"
                                            value={formData.signatureDate}
                                            onChange={(e) => handleChange('signatureDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">Assine com o dedo ou mouse no espaço abaixo:</p>
                                <SignaturePad
                                    value={formData.signatureData}
                                    onChange={(data) => handleChange('signatureData', data)}
                                    height={192}
                                />
                            </div>
                        </section>

                        {/* Botão Submit */}
                        <div className="sticky bottom-4 z-20">
                            <button
                                className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-70"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></span>
                                ) : null}
                                <span>{isSubmitting ? 'Enviando...' : 'Confirmar Inscrição'}</span>
                                {!isSubmitting && <span className="material-symbols-outlined">send</span>}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <footer className="mt-16 pb-6 text-center text-sm text-[#64748B]">
                        <p className="mb-2">© 2026 Acampamento Buscapé. Todos os direitos reservados.</p>
                        <div className="flex justify-center gap-4 text-xs">
                            <a className="hover:text-[#2563EB] transition-colors cursor-pointer">Política de Privacidade</a>
                            <span>•</span>
                            <a className="hover:text-[#2563EB] transition-colors cursor-pointer">Termos de Uso</a>
                            <span>•</span>
                            <a className="hover:text-[#2563EB] transition-colors cursor-pointer">Contato</a>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default PublicRegistrationView;
