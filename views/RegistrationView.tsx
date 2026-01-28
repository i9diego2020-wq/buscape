
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import { supabase } from '../lib/supabase';
import { Season } from '../types';

interface RegistrationFormData {
  // Opções
  options: string[];
  season: string;
  period: string;

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

  // Assinatura
  signatureLocation: string;
  signatureDate: string;
}

const initialFormData: RegistrationFormData = {
  options: ['Embarque ABC'],
  season: '',
  period: '',
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
  signatureLocation: 'São Paulo',
  signatureDate: new Date().toISOString().split('T')[0],
};

const availableOptions = ['Embarque ABC', 'Embarque SP', 'Direto p/ Bragança', 'Camiseta', 'Kart', 'Parque Radical', 'Agasalho'];

const RegistrationView: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estados para temporadas e períodos
  const [seasons, setSeasons] = React.useState<{ id: string, name: string }[]>([]);
  const [periods, setPeriods] = React.useState<{ id: string, label: string, season_id: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = React.useState(true);
  const [loadingCep, setLoadingCep] = useState(false);

  React.useEffect(() => {
    const fetchOptions = async () => {
      const { data: seasonsData } = await supabase.from('seasons').select('id, name').eq('status', 'active');
      const { data: periodsData } = await supabase.from('periods').select('id, label, season_id');
      if (seasonsData) setSeasons(seasonsData);
      if (periodsData) setPeriods(periodsData);
      setLoadingOptions(false);
    };
    fetchOptions();
  }, []);

  // Formatação e Cálculos
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const formatCpf = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };

  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age.toString() : '';
  };

  const handlePhoneChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: formatPhone(value) }));
  };

  const handleCpfChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: formatCpf(value) }));
  };

  const handleBirthDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, childBirthDate: value, childAge: calculateAge(value) }));
  };

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    setLoadingCep(true);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await resp.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          addressStreet: data.logradouro || '',
          addressNeighborhood: data.bairro || '',
          addressCity: `${data.localidade}/${data.uf}` || '',
        }));
      }
    } catch (e) { console.error(e); }
    setLoadingCep(false);
  };

  const handleCepChange = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    let formatted = numbers;
    if (numbers.length > 5) formatted = `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    setFormData(prev => ({ ...prev, addressCep: formatted }));
    if (numbers.length === 8) fetchCep(numbers);
  };

  const handleChange = (field: keyof RegistrationFormData, value: any) => {
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
        season: formData.season,
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
        parents_absent: formData.parentsAbsent === 'Sim',
        authorize_third_party: formData.authorizeThirdParty === 'Sim',
        authorized_person_name: formData.authorizedPersonName || null,
        can_swim: formData.canSwim === 'Sim',
        will_use_floats: formData.willUseFloats === 'Sim',
        signature_location: formData.signatureLocation || null,
        signature_date: formData.signatureDate || null,
        payment_amount: 350.00,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData(initialFormData);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar inscrição. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="bg-success/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <span className="material-symbols-outlined text-success text-5xl">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Inscrição Enviada com Sucesso!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          A inscrição foi registrada e está aguardando aprovação. Entraremos em contato em breve.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
          >
            Nova Inscrição
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ficha de Inscrição</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Preencha os dados abaixo com atenção para registrar o campista.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormSection title="Temporada e Opções" icon="tune">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Temporada *</label>
              <select
                value={formData.season}
                onChange={(e) => {
                  handleChange('season', e.target.value);
                  handleChange('period', '');
                }}
                className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                required
                disabled={loadingOptions}
              >
                <option value="">{loadingOptions ? 'Carregando...' : 'Selecione a temporada'}</option>
                {seasons.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Período *</label>
              <select
                value={formData.period}
                onChange={(e) => handleChange('period', e.target.value)}
                className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                required
                disabled={!formData.season}
              >
                <option value="">{!formData.season ? 'Selecione a temporada primeiro' : 'Selecione o período'}</option>
                {periods.filter(p => seasons.find(s => s.name === formData.season)?.id === p.season_id).map(p => (
                  <option key={p.id} value={p.label}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableOptions.map((option) => (
              <label key={option} className="cursor-pointer relative group">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={formData.options.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                />
                <div className="h-full flex items-center justify-center rounded-lg border border-slate-200 dark:border-border-dark px-3 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  {option}
                </div>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Dados da Criança" icon="face">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nome completo *"
                placeholder="Nome do campista"
                type="text"
                required
                value={formData.childName}
                onChange={(e) => handleChange('childName', e.target.value)}
              />
            </div>
            <Input
              label="Data de nascimento *"
              type="date"
              required
              value={formData.childBirthDate}
              onChange={(e) => handleBirthDateChange(e.target.value)}
            />
            <Input
              label="Idade"
              placeholder="Ex: 10"
              type="number"
              value={formData.childAge}
              readOnly
            />
            <Input
              label="RG"
              type="text"
              value={formData.childRg}
              onChange={(e) => handleChange('childRg', e.target.value)}
            />
            <Input
              label="Série escolar"
              type="text"
              value={formData.childSchoolGrade}
              onChange={(e) => handleChange('childSchoolGrade', e.target.value)}
            />
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-border-dark mt-8">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Endereço Residencial</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Input
                    label="CEP"
                    type="text"
                    placeholder="00000-000"
                    value={formData.addressCep}
                    onChange={(e) => handleCepChange(e.target.value)}
                  />
                  {loadingCep && <div className="absolute right-3 top-[38px] animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>}
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Input
                    label="Logradouro"
                    type="text"
                    value={formData.addressStreet}
                    onChange={(e) => handleChange('addressStreet', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="Nº"
                    type="text"
                    value={formData.addressNumber}
                    onChange={(e) => handleChange('addressNumber', e.target.value)}
                  />
                </div>
              </div>
              <Input
                label="Bairro"
                type="text"
                value={formData.addressNeighborhood}
                onChange={(e) => handleChange('addressNeighborhood', e.target.value)}
              />
              <Input
                label="Cidade"
                type="text"
                value={formData.addressCity}
                onChange={(e) => handleChange('addressCity', e.target.value)}
              />
            </div>
          </div>
        </FormSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormSection title="Dados da Mãe" icon="female">
            <div className="space-y-4">
              <Input
                label="Nome da mãe"
                type="text"
                value={formData.motherName}
                onChange={(e) => handleChange('motherName', e.target.value)}
              />
              <Input
                label="Onde trabalha"
                type="text"
                value={formData.motherWorkplace}
                onChange={(e) => handleChange('motherWorkplace', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CPF"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.motherCpf}
                  onChange={(e) => handleCpfChange('motherCpf', e.target.value)}
                />
                <Input
                  label="Telefone"
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={formData.motherPhone}
                  onChange={(e) => handlePhoneChange('motherPhone', e.target.value)}
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="exemplo@gmail.com"
                value={formData.motherEmail}
                onChange={(e) => handleChange('motherEmail', e.target.value)}
              />
            </div>
          </FormSection>

          <FormSection title="Dados do Pai" icon="male">
            <div className="space-y-4">
              <Input
                label="Nome do pai"
                type="text"
                value={formData.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
              />
              <Input
                label="Onde trabalha"
                type="text"
                value={formData.fatherWorkplace}
                onChange={(e) => handleChange('fatherWorkplace', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CPF"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.fatherCpf}
                  onChange={(e) => handleCpfChange('fatherCpf', e.target.value)}
                />
                <Input
                  label="Telefone"
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={formData.fatherPhone}
                  onChange={(e) => handlePhoneChange('fatherPhone', e.target.value)}
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="exemplo@gmail.com"
                value={formData.fatherEmail}
                onChange={(e) => handleChange('fatherEmail', e.target.value)}
              />
            </div>
          </FormSection>
        </div>

        <FormSection title="Contato de Emergência" icon="emergency">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nome do contato *"
                type="text"
                required
                value={formData.emergencyContactName}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
              />
            </div>
            <Input
              label="Parentesco"
              type="text"
              value={formData.emergencyContactRelation}
              onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
            />
            <Input
              label="Telefone principal *"
              type="text"
              required
              placeholder="(11) 99999-9999"
              value={formData.emergencyContactPhone}
              onChange={(e) => handlePhoneChange('emergencyContactPhone', e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Telefone secundário"
                type="text"
                placeholder="(11) 99999-9999"
                value={formData.emergencyContactPhoneSecondary}
                onChange={(e) => handlePhoneChange('emergencyContactPhoneSecondary', e.target.value)}
              />
            </div>
          </div>
        </FormSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormSection title="Informações e Saúde" icon="info">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sabe nadar?</label>
                <select
                  className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                  value={formData.canSwim}
                  onChange={(e) => handleChange('canSwim', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Usará boias?</label>
                <select
                  className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                  value={formData.willUseFloats}
                  onChange={(e) => handleChange('willUseFloats', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {formData.willUseFloats === 'Sim' && <p className="text-[10px] text-danger mt-1">Pais devem providenciar boias.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pais ausentes?</label>
                <select
                  className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                  value={formData.parentsAbsent}
                  onChange={(e) => handleChange('parentsAbsent', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
            </div>
          </FormSection>

          <FormSection title="Autorizações" icon="verified_user">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Autoriza terceiros?</label>
                <select
                  className="w-full rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
                  value={formData.authorizeThirdParty}
                  onChange={(e) => handleChange('authorizeThirdParty', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              {formData.authorizeThirdParty === 'Sim' && (
                <Input
                  label="Nome da pessoa autorizada *"
                  type="text"
                  required
                  value={formData.authorizedPersonName}
                  onChange={(e) => handleChange('authorizedPersonName', e.target.value)}
                />
              )}
            </div>
          </FormSection>
        </div>

        <FormSection title="Assinatura Digital" icon="draw">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-5 mb-6 border border-primary/20">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "Declaro que autorizo a participação do menor nas atividades do Acampamento Buscapé, estando ciente das normas e condições estabelecidas."
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Local"
              type="text"
              value={formData.signatureLocation}
              onChange={(e) => handleChange('signatureLocation', e.target.value)}
            />
            <Input
              label="Data"
              type="date"
              value={formData.signatureDate}
              onChange={(e) => handleChange('signatureDate', e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase font-bold tracking-widest">Espaço para assinatura:</p>
          <div className="w-full h-48 border-2 border-dashed border-slate-200 dark:border-border-dark rounded-xl bg-slate-50 dark:bg-slate-800/50 relative cursor-crosshair group hover:border-primary transition-colors flex items-center justify-center">
            <span className="text-slate-300 dark:text-slate-600 font-medium pointer-events-none text-sm group-hover:text-primary transition-colors italic">Assine aqui usando o mouse ou dedo</span>
          </div>
          <div className="flex justify-end mt-4">
            <button type="button" className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-danger uppercase tracking-widest transition-colors">Limpar Assinatura</button>
          </div>
        </FormSection>

        <div className="sticky bottom-6 z-20">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-lg rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full mr-2"></span>
            ) : null}
            <span>{isSubmitting ? 'Enviando...' : 'Confirmar Inscrição'}</span>
            {!isSubmitting && <span className="material-symbols-outlined">send</span>}
          </button>
        </div>
      </form>

      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
        © 2026 Acampamento Buscapé. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default RegistrationView;
