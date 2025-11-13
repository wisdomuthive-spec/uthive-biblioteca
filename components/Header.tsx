import React from 'react';
import { BookIcon, PlusIcon, LogoutIcon, AdminIcon } from './Icons';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onAddResourceClick: () => void;
  onLogout: () => void;
  onNavigate: (view: 'library' | 'my-resources' | 'admin-dashboard') => void;
  currentView: string;
}

const roleLabels: Record<User['role'], string> = {
  student: 'Aluno(a)',
  teacher: 'Professor(a)',
  admin: 'Administrador(a)',
};

export const Header: React.FC<HeaderProps> = ({ user, onAddResourceClick, onLogout, onNavigate, currentView }) => {
  const isStudent = user.role === 'student';

  const navItemClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-colors";
  const activeNavItemClasses = "bg-slate-700 text-white";
  const inactiveNavItemClasses = "text-gray-300 hover:bg-slate-700/50 hover:text-white";
  
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('library')} className="p-2 rounded-full hover:bg-slate-700 transition-colors" title="Voltar ao Acervo">
              <BookIcon className="h-7 w-7 text-cyan-400" />
            </button>
            {isStudent && (
              <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg">
                <button 
                  onClick={() => onNavigate('library')} 
                  className={`${navItemClasses} ${currentView === 'library' ? activeNavItemClasses : inactiveNavItemClasses}`}
                >
                  Acervo
                </button>
                <button 
                  onClick={() => onNavigate('my-resources')} 
                  className={`${navItemClasses} ${currentView === 'my-resources' ? activeNavItemClasses : inactiveNavItemClasses}`}
                >
                  Meus Recursos
                </button>
              </div>
            )}
            {(user.role === 'teacher' || user.role === 'admin') && (
              <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">
                Biblioteca Digital
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
              >
                <AdminIcon className="w-5 h-5" />
                <span className="hidden md:inline">Painel Admin</span>
              </button>
            )}
            {(user.role === 'teacher' || user.role === 'admin') && (
              <button
                onClick={onAddResourceClick}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Adicionar Recurso</span>
              </button>
            )}
            <div className="text-right">
              <p className="font-semibold text-white text-sm">{user.name}</p>
              <p className="text-xs text-gray-400">{roleLabels[user.role]}</p>
            </div>
            <button
              onClick={onLogout}
              title="Sair"
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
