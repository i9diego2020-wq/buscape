
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import { supabase } from '../lib/supabase';
import { Season } from '../types';

interface RegistrationFormData {
  // Opções
  options: string[];
  season: Season;

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
  motherCpf: string;
  motherPhone: string;
  motherEmail: string;

  // Dados do pai
  fatherName: string;
  fatherCpf: string;
  fatherPhone: string;
  fatherEmail: string;

  // Assinatura
  signatureLocation: string;
  signatureDate: string;
}

const initialFormData: RegistrationFormData = {
  options: ['Embarque ABC'],
  season: Season.SUMMER_2026,
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
  motherCpf: '',
  motherPhone: '',
  motherEmail: '',
  fatherName: '',
  fatherCpf: '',
  fatherPhone: '',
  fatherEmail: '',
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

  const handleChange = (field: keyof RegistrationFormData, value: string) => {
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
        mother_cpf: formData.motherCpf || null,
        mother_phone: formData.motherPhone || null,
        mother_email: formData.motherEmail || null,
        father_name: formData.fatherName || null,
        father_cpf: formData.fatherCpf || null,
        father_phone: formData.fatherPhone || null,
        father_email: formData.fatherEmail || null,
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Temporada *</label>
            <select
              value={formData.season}
              onChange={(e) => handleChange('season', e.target.value)}
              className="w-full md:w-64 rounded-lg border-slate-300 dark:border-border-dark bg-white dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary text-slate-800 dark:text-white px-3 py-2"
              required
            >
              <option value={Season.SUMMER_2026}>Verão 2026</option>
              <option value={Season.WINTER_2026}>Inverno 2026</option>
            </select>
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
              onChange={(e) => handleChange('childBirthDate', e.target.value)}
            />
            <Input
              label="Idade"
              placeholder="Ex: 10"
              type="number"
              value={formData.childAge}
              onChange={(e) => handleChange('childAge', e.target.value)}
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
                <Input
                  label="CEP"
                  type="text"
                  value={formData.addressCep}
                  onChange={(e) => handleChange('addressCep', e.target.value)}
                />
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CPF"
                  type="text"
                  value={formData.motherCpf}
                  onChange={(e) => handleChange('motherCpf', e.target.value)}
                />
                <Input
                  label="Telefone"
                  type="text"
                  value={formData.motherPhone}
                  onChange={(e) => handleChange('motherPhone', e.target.value)}
                />
              </div>
              <Input
                label="Email"
                type="email"
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CPF"
                  type="text"
                  value={formData.fatherCpf}
                  onChange={(e) => handleChange('fatherCpf', e.target.value)}
                />
                <Input
                  label="Telefone"
                  type="text"
                  value={formData.fatherPhone}
                  onChange={(e) => handleChange('fatherPhone', e.target.value)}
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={formData.fatherEmail}
                onChange={(e) => handleChange('fatherEmail', e.target.value)}
              />
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
