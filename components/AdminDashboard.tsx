import React from 'react';
// Fix: Use the 'Resource' type as 'Book' is not an exported member of '../types'.
import type { User, Resource, ReadingActivity, StudentActivity } from '../types';
import { AdminIcon, UserGroupIcon, BookIcon, ChartBarIcon, TrashIcon, PencilIcon } from './Icons';

interface AdminDashboardProps {
  users: User[];
  // Fix: Use the 'Resource' type as 'Book' is not an exported member of '../types'.
  books: Resource[];
  readingActivity: ReadingActivity[];
  studentActivity: StudentActivity[];
}

const roleLabels: Record<User['role'], string> = {
  student: 'Aluno',
  teacher: 'Professor',
  admin: 'Admin',
};
const roleColors: Record<User['role'], string> = {
    student: 'bg-blue-500/20 text-blue-300',
    teacher: 'bg-green-500/20 text-green-300',
    admin: 'bg-indigo-500/20 text-indigo-300',
};


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, books, readingActivity, studentActivity }) => {
    
  const totalBooksReadThisWeek = readingActivity.reduce((sum, day) => sum + day.booksRead, 0);
  const averageTimeSpent = studentActivity.reduce((sum, student) => sum + student.timeSpentMinutes, 0) / (studentActivity.length || 1);

  return (
    <section className="animate-fade-in space-y-12">
      <div className="flex items-center space-x-4">
        <AdminIcon className="w-10 h-10 text-indigo-400" />
        <h1 className="text-4xl font-bold text-white">Painel de Administração</h1>
      </div>

      {/* Seção de Relatórios */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ChartBarIcon className="w-7 h-7 text-cyan-400" />
          <h2 className="text-2xl font-semibold text-white">Relatórios de Atividade</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card de Livros Lidos */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                <h3 className="text-lg font-semibold text-gray-300">Livros Lidos na Semana</h3>
                <p className="text-4xl font-bold text-cyan-400 my-2">{totalBooksReadThisWeek}</p>
                <div className="flex items-end gap-1 h-24">
                    {readingActivity.map(day => (
                        <div key={day.day} className="flex-1 flex flex-col items-center justify-end" title={`${day.booksRead} livros`}>
                            <div className="w-full bg-cyan-500/50 hover:bg-cyan-500 transition-colors" style={{ height: `${(day.booksRead / Math.max(...readingActivity.map(d => d.booksRead))) * 100}%`}}></div>
                            <span className="text-xs text-gray-400 mt-1">{day.day}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Card de Tempo Médio */}
             <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                <h3 className="text-lg font-semibold text-gray-300">Tempo Médio de Atividade</h3>
                <p className="text-4xl font-bold text-green-400 my-2">{averageTimeSpent.toFixed(0)} <span className="text-2xl text-gray-400">min/aluno</span></p>
                <p className="text-sm text-gray-500">Média de tempo gasto na plataforma esta semana.</p>
            </div>
            {/* Card de Usuários Ativos */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                <h3 className="text-lg font-semibold text-gray-300">Usuários Ativos</h3>
                <p className="text-4xl font-bold text-yellow-400 my-2">{users.length}</p>
                 <p className="text-sm text-gray-500">Total de usuários cadastrados na plataforma.</p>
            </div>
        </div>
      </div>


      {/* Seção de Gerenciamento de Usuários */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <UserGroupIcon className="w-7 h-7 text-cyan-400" />
          <h2 className="text-2xl font-semibold text-white">Gerenciar Usuários</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Nome</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Email</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Papel</th>
                <th scope="col" className="relative py-3.5 px-4"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-white">{user.name}</td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">{user.email}</td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-3"><PencilIcon className="w-5 h-5"/></button>
                    <button className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Seção de Gerenciamento de Livros */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BookIcon className="w-7 h-7 text-cyan-400" />
          <h2 className="text-2xl font-semibold text-white">Gerenciar Acervo</h2>
        </div>
         <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Título</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Autor</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Status</th>
                <th scope="col" className="relative py-3.5 px-4"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {books.map(book => (
                <tr key={book.id}>
                  <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-white">{book.titulo}</td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">{book.autor}</td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm">
                    {book.borrowedBy !== null ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300">Emprestado</span>
                    ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300">Disponível</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-3"><PencilIcon className="w-5 h-5"/></button>
                    <button className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
