import React, { useState } from 'react';
import type { User, Resource, ActivityLog } from '../types';
import { DashboardIcon, UserGroupIcon, ChevronDownIcon } from './Icons';

interface TeacherDashboardProps {
  teacher: User;
  allUsers: User[];
  allResources: Resource[];
  allLogs: ActivityLog[];
}

const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} s`;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, allUsers, allResources, allLogs }) => {
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

  const myStudents = allUsers.filter(user => user.role === 'student' && user.teacherId === teacher.id);
  
  const getResourceTitle = (resourceId: number) => {
    return allResources.find(r => r.id === resourceId)?.titulo || 'Recurso Desconhecido';
  }

  const toggleStudent = (studentId: number) => {
    setExpandedStudentId(prevId => (prevId === studentId ? null : studentId));
  }

  return (
    <section className="mb-12 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <DashboardIcon className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Painel de Monitoramento</h2>
      </div>
      
      <div className="space-y-4">
        {myStudents.length > 0 ? (
          myStudents.map(student => {
            const studentLogs = allLogs.filter(log => log.studentId === student.id);
            const isExpanded = expandedStudentId === student.id;

            return (
                <div key={student.id} className="bg-slate-800 rounded-lg border border-slate-600 overflow-hidden">
                    <button onClick={() => toggleStudent(student.id)} className="w-full flex justify-between items-center p-4 text-left">
                        <div className="flex items-center space-x-3">
                            <UserGroupIcon className="w-6 h-6 text-gray-400"/>
                            <h3 className="font-semibold text-lg text-white">{student.name}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-sm text-gray-400">{studentLogs.length} atividades registradas</span>
                           <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    
                    {isExpanded && (
                       <div className="bg-slate-900/50 p-4 border-t border-slate-600">
                         {studentLogs.length > 0 ? (
                            <div className="overflow-x-auto">
                               <table className="min-w-full text-sm">
                                  <thead className="text-left text-gray-400">
                                      <tr>
                                          <th className="p-2">Recurso</th>
                                          <th className="p-2">Data</th>
                                          <th className="p-2">Duração</th>
                                          <th className="p-2">Progresso</th>
                                          <th className="p-2">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {studentLogs.sort((a,b) => b.startTime - a.startTime).map(log => (
                                          <tr key={log.id} className="border-b border-slate-700 last:border-0">
                                              <td className="p-2 font-medium text-white">{getResourceTitle(log.resourceId)}</td>
                                              <td className="p-2 text-gray-300">{new Date(log.startTime).toLocaleDateString()}</td>
                                              <td className="p-2 text-gray-300">{formatDuration(log.durationSeconds)}</td>
                                              <td className="p-2 text-gray-300">
                                                  <div className="w-full bg-slate-600 rounded-full h-2.5">
                                                      <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${log.progress}%` }}></div>
                                                  </div>
                                                  <span className="text-xs">{Math.round(log.progress)}% concluído</span>
                                              </td>
                                              <td className="p-2">
                                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${log.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                                      {log.status === 'completed' ? 'Concluído' : 'Em Progresso'}
                                                  </span>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                               </table>
                            </div>
                         ) : (
                           <p className="text-center text-gray-500 py-4">Nenhuma atividade registrada para este aluno.</p>
                         )}
                       </div>
                    )}
                </div>
            )
          })
        ) : (
          <p className="text-center text-gray-500 py-4">Você ainda não tem alunos cadastrados.</p>
        )}
      </div>
    </section>
  );
};
