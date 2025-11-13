import React, { useState } from 'react';
import type { User } from '../types';
import { BookIcon } from './Icons';

interface AuthProps {
  onLogin: (email: string, pass: string) => void;
  onRegister: (user: Omit<User, 'id'>) => void;
  institutions: string[];
  teachers: User[];
}

type AuthMode = 'login' | 'register';

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, institutions, teachers }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [institution, setInstitution] = useState(institutions[0] || '');
  const [teacherId, setTeacherId] = useState<string>(teachers.length > 0 ? String(teachers[0].id) : '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else {
      const newUser: Omit<User, 'id'> = {
        name,
        email,
        password,
        role,
        institution,
        ...(role === 'student' && { teacherId: parseInt(teacherId, 10) }),
      };
      onRegister(newUser);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Hero Section */}
      <header 
        className="relative bg-cover bg-center h-[50vh] flex flex-col items-center justify-center text-center p-4"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-black/50"></div>
        <div className="relative z-10 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Leia. Aprenda. Cresça.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Encontre e explore seu próximo livro. Fácil, digital e feito para você. Bem-vindo à sua Biblioteca Digital Escolar.
          </p>
        </div>
      </header>
      
      {/* Form Section */}
      <main className="-mt-32 relative z-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-2xl font-bold text-center text-white mb-6">
                {mode === 'login' ? 'Acessar sua conta' : 'Criar nova conta'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Instituição</label>
                      <select value={institution} onChange={e => setInstitution(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
                        {institutions.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Eu sou</label>
                      <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
                        <option value="student">Aluno(a)</option>
                        <option value="teacher">Professor(a)</option>
                      </select>
                    </div>
                    {role === 'student' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Meu Professor(a)</label>
                        <select value={teacherId} onChange={e => setTeacherId(e.target.value)} required className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
                          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"/>
                </div>
                <button type="submit" className="w-full py-3 px-4 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors">
                  {mode === 'login' ? 'Entrar' : 'Registrar'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button onClick={toggleMode} className="text-sm text-cyan-400 hover:underline">
                  {mode === 'login' ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <div className="flex justify-center items-center mb-4 space-x-3">
            <BookIcon className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">Biblioteca Digital</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Todos os direitos reservados. Feito para aprendizado.</p>
        </div>
      </footer>
    </div>
  );
};
