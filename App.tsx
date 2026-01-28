import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import RegistrationView from './views/RegistrationView';
import RegistrationsListView from './views/RegistrationsListView';
import PublicRegistrationView from './views/PublicRegistrationView';
import CampistasView from './views/CampistasView';
import CamperDetailView from './views/CamperDetailView';
import RegistrationDetailView from './views/RegistrationDetailView';
import SettingsView from './views/SettingsView';
import InvoicesView from './views/InvoicesView';
import PermissionsView from './views/PermissionsView';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const AdminContent: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar
          user={{
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url,
            role: user.user_metadata?.role || 'staff'
          }}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar">
          <Routes>
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/inscricoes" element={<RegistrationsListView />} />
            <Route path="/inscricoes/nova" element={<RegistrationView />} />
            <Route path="/inscricoes/:id" element={<RegistrationDetailView />} />
            <Route path="/campistas" element={<CampistasView />} />
            <Route path="/campistas/:id" element={<CamperDetailView />} />
            <Route path="/invoices" element={<InvoicesView />} />
            <Route path="/permissoes" element={<PermissionsView />} />
            <Route path="/configuracao" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Rota pública para pais fazerem inscrição - não requer login */}
          <Route path="/inscricao" element={<PublicRegistrationView />} />

          {/* Todas as outras rotas são protegidas (admin) */}
          <Route path="/*" element={<AdminContent />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
