
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useDarkMode from '../hooks/useDarkMode';
import Input from '../components/Input';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(getErrorMessage(error.message));
        } else {
          setError(null);
          alert('Conta criada! Verifique seu email para confirmar o cadastro.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(getErrorMessage(error.message));
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (message: string): string => {
    if (message.includes('Invalid login credentials')) {
      return 'Email ou senha incorretos.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Por favor, confirme seu email antes de fazer login.';
    }
    if (message.includes('User already registered')) {
      return 'Este email já está cadastrado.';
    }
    if (message.includes('Password should be')) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    return message;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 transition-colors">
      <button
        onClick={toggleDarkMode}
        className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition focus:outline-none"
      >
        <span className="material-symbols-outlined block dark:hidden">dark_mode</span>
        <span className="material-symbols-outlined hidden dark:block">light_mode</span>
      </button>

      <div className="w-full max-w-[450px] bg-white dark:bg-surface-dark rounded-xl shadow-card dark:shadow-card-dark p-8 sm:p-10 transition-colors border border-transparent dark:border-border-dark">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-4xl font-bold">camping</span>
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Buscapé</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white mb-1.5">
            {isSignUp ? 'Criar Conta 🚀' : 'Bem-vindo ao Buscapé! 👋'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isSignUp
              ? 'Preencha os dados abaixo para criar sua conta.'
              : 'Por favor, faça login em sua conta de administrador.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Senha</label>
              {!isSignUp && (
                <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover">Esqueceu a senha?</a>
              )}
            </div>
            <div className="relative">
              <input
                className="w-full px-3 py-2 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-10"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="············"
                required
                minLength={6}
              />
              <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">visibility_off</span>
              </span>
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center">
              <input
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-background-dark cursor-pointer"
                id="remember-me"
                type="checkbox"
              />
              <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none" htmlFor="remember-me">
                Lembrar de mim
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-primary/30 disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            ) : null}
            {isSignUp ? 'Criar Conta' : 'Login'}
          </button>
        </form>

        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-light dark:border-border-dark"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-surface-dark text-slate-400">ou</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button className="flex items-center justify-center w-9 h-9 rounded-md bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20 transition-colors">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"></path></svg>
          </button>
          <button className="flex items-center justify-center w-9 h-9 rounded-md bg-[#DB4437]/10 text-[#DB4437] hover:bg-[#DB4437]/20 transition-colors">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.55 10.24h-1.64v3.52h3.29c-.36 1.84-2.29 2.5-3.32 1.81c-1.38-.9-1.64-2.82-1.03-4.14c.48-1.04 1.55-1.46 2.53-1.31c.64.1 1.15.42 1.53.79l2.6-2.6C15.17 6.94 13.91 6.5 12.52 6.5C8.98 6.5 6.4 9.69 6.8 13.2c.28 2.5 2.41 4.3 4.93 4.3c2.42 0 4.24-1.45 4.67-3.79c.07-.36.1-.74.1-1.11h-3.95v-2.36Z"></path></svg>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? (
            <>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(null); }}
                className="text-primary font-medium hover:underline"
              >
                Fazer Login
              </button>
            </>
          ) : (
            <>
              Novo na plataforma?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(null); }}
                className="text-primary font-medium hover:underline"
              >
                Crie uma conta
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginView;
