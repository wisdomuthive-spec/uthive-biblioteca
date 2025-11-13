import React from 'react';
import type { Resource, User } from '../types';
import { BookIcon, PlayIcon, MicIcon } from './Icons';

interface ResourceCardProps {
  resource: Resource;
  currentUser: User;
  onBorrow: (id: number) => void;
  onReturn: (id: number) => void;
  onOpen: (resource: Resource) => void;
}

// Fix: Changed type from React.ReactNode to React.ReactElement for better type safety with React components.
// Fix: Pass className to all icons for consistent sizing and remove the need for React.cloneElement.
const typeIcons: Record<Resource['type'], React.ReactElement> = {
    book: <BookIcon className="w-5 h-5" />,
    audiobook: <BookIcon className="w-5 h-5" />,
    video: <PlayIcon className="w-5 h-5" />,
    audio: <MicIcon className="w-5 h-5" />,
};
const typeLabels: Record<Resource['type'], string> = {
    book: 'Livro',
    audiobook: 'Audiobook',
    video: 'Vídeo',
    audio: 'Áudio',
};


export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, currentUser, onBorrow, onReturn, onOpen }) => {
  const isAvailable = resource.borrowedBy === null;
  const isBorrowedByCurrentUser = resource.borrowedBy === currentUser.id;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 shadow-lg">
       <div className="relative">
         <img
            src={resource.capaUrl}
            alt={`Capa de ${resource.titulo}`}
            className="w-full h-64 object-cover"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Capa+Indisponível'; }}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-2 rounded-full" title={typeLabels[resource.type]}>
            {/* Fix: Resolved typing issue by rendering the pre-styled icon directly instead of using React.cloneElement. */}
            {typeIcons[resource.type]}
        </div>
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 text-xs rounded-md font-semibold">
            {resource.category}
        </div>
       </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white">{resource.titulo}</h3>
        <p className="text-sm text-cyan-400 mb-2">{resource.autor}</p>
        <p className="text-gray-400 text-sm flex-grow mb-4">{resource.sinopse}</p>
        <div className="mt-auto flex justify-between items-center">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isAvailable ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
            {isAvailable ? 'Disponível' : 'Emprestado'}
          </span>
          {currentUser.role === 'student' && (
            <div className="flex items-center gap-2">
              {isAvailable && (
                <button
                  onClick={() => onBorrow(resource.id)}
                  className="px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-md hover:bg-cyan-700 transition-colors"
                >
                  Acessar
                </button>
              )}
              {isBorrowedByCurrentUser && (
                <>
                  <button
                    onClick={() => onOpen(resource)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Abrir
                  </button>
                  <button
                    onClick={() => onReturn(resource.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
                  >
                    Devolver
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
