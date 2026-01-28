
import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import SearchInput from '../components/SearchInput';

interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    color: string;
    usersCount: number;
    permissions: string[];
}

const PERMISSIONS: Permission[] = [
    { id: 'view_dashboard', name: 'Ver Dashboard', description: 'Acesso ao painel principal', module: 'Dashboard' },
    { id: 'view_registrations', name: 'Ver Inscrições', description: 'Listar inscrições', module: 'Inscrições' },
    { id: 'edit_registrations', name: 'Editar Inscrições', description: 'Modificar inscrições', module: 'Inscrições' },
    { id: 'delete_registrations', name: 'Excluir Inscrições', description: 'Remover inscrições', module: 'Inscrições' },
    { id: 'view_campers', name: 'Ver Campistas', description: 'Listar campistas', module: 'Campistas' },
    { id: 'edit_campers', name: 'Editar Campistas', description: 'Modificar campistas', module: 'Campistas' },
    { id: 'view_invoices', name: 'Ver Faturas', description: 'Listar faturas', module: 'Financeiro' },
    { id: 'manage_settings', name: 'Gerenciar Configurações', description: 'Alterar configurações do sistema', module: 'Sistema' },
    { id: 'manage_permissions', name: 'Gerenciar Permissões', description: 'Alterar permissões de usuários', module: 'Sistema' },
];

const ROLES: Role[] = [
    { id: 'admin', name: 'Administrador', description: 'Acesso total ao sistema', color: 'primary', usersCount: 2, permissions: PERMISSIONS.map(p => p.id) },
    { id: 'staff', name: 'Staff', description: 'Gerencia campistas e inscrições', color: 'info', usersCount: 5, permissions: ['view_dashboard', 'view_registrations', 'edit_registrations', 'view_campers', 'edit_campers'] },
    { id: 'finance', name: 'Financeiro', description: 'Acesso às faturas e pagamentos', color: 'success', usersCount: 3, permissions: ['view_dashboard', 'view_invoices', 'view_registrations'] },
    { id: 'viewer', name: 'Visualizador', description: 'Apenas visualização', color: 'secondary', usersCount: 8, permissions: ['view_dashboard', 'view_registrations', 'view_campers'] },
];

const PermissionsView: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(ROLES[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPermissions = PERMISSIONS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Permissões</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie cargos e permissões de acesso ao sistema.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Novo Cargo
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Roles List */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-border-dark">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Cargos</h2>
                    </div>
                    <div className="p-3 space-y-2">
                        {ROLES.map(role => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={`w-full p-4 rounded-lg text-left transition-all ${selectedRole?.id === role.id
                                        ? 'bg-primary/10 border-2 border-primary'
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-slate-800 dark:text-white">{role.name}</span>
                                    <StatusBadge variant={role.color as any}>{role.usersCount} usuários</StatusBadge>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{role.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark border border-transparent dark:border-border-dark overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                Permissões: {selectedRole?.name}
                            </h2>
                            <p className="text-sm text-slate-500">{selectedRole?.permissions.length} permissões ativas</p>
                        </div>
                        <SearchInput
                            placeholder="Buscar permissão..."
                            className="w-full sm:w-64"
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                    </div>
                    <div className="p-5 space-y-6 max-h-[500px] overflow-y-auto">
                        {Object.entries(groupedPermissions).map(([module, perms]) => (
                            <div key={module}>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{module}</h3>
                                <div className="space-y-2">
                                    {perms.map(perm => {
                                        const isEnabled = selectedRole?.permissions.includes(perm.id);
                                        return (
                                            <div
                                                key={perm.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{perm.name}</p>
                                                    <p className="text-xs text-slate-400">{perm.description}</p>
                                                </div>
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={isEnabled}
                                                        onChange={() => { }}
                                                    />
                                                    <div className={`w-11 h-6 rounded-full peer transition-colors ${isEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-5 border-t border-slate-100 dark:border-border-dark flex justify-end gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                            Cancelar
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors shadow-lg shadow-primary/30">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionsView;
