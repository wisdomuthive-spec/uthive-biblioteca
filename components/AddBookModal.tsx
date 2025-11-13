import React, { useState } from 'react';
import type { Resource } from '../types';
import { CloseIcon } from './Icons';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: Omit<Resource, 'id' | 'borrowedBy' | 'content'>) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, onAddResource }) => {
  const [type, setType] = useState<Resource['type']>('book');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('Ficção');

  const resetForm = () => {
    setType('book');
    setTitulo('');
    setAutor('');
    setSinopse('');
    setCapaUrl('');
    setAudioUrl('');
    setVideoUrl('');
    setCategory('Ficção');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !autor || !capaUrl || !category) {
      alert('Por favor, preencha Título, Autor, URL da Capa e Categoria.');
      return;
    }
    
    const resourceData: Omit<Resource, 'id' | 'borrowedBy' | 'content'> = {
      type,
      titulo,
      autor,
      sinopse,
      capaUrl,
      category,
      audioUrl: type === 'audio' || type === 'audiobook' ? audioUrl : undefined,
      videoUrl: type === 'video' ? videoUrl : undefined,
    };

    onAddResource(resourceData);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 border border-slate-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Adicionar Novo Recurso</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300">Tipo de Recurso</label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value as Resource['type'])} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                  <option value="book">Livro</option>
                  <option value="audiobook">Audiobook</option>
                  <option value="video">Vídeo</option>
                  <option value="audio">Áudio</option>
              </select>
            </div>
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-300">Título</label>
              <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            <div>
              <label htmlFor="autor" className="block text-sm font-medium text-gray-300">Autor / Criador</label>
              <input type="text" id="autor" value={autor} onChange={(e) => setAutor(e.target.value)} required className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Categoria</label>
                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            <div>
              <label htmlFor="capaUrl" className="block text-sm font-medium text-gray-300">URL da Imagem de Capa</label>
              <input type="url" id="capaUrl" value={capaUrl} onChange={(e) => setCapaUrl(e.target.value)} required className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            {(type === 'audio' || type === 'audiobook') && (
              <div>
                <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-300">URL do Áudio</label>
                <input type="url" id="audioUrl" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} required className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
              </div>
            )}
            {type === 'video' && (
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300">URL do Vídeo</label>
                <input type="url" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"/>
              </div>
            )}
            <div>
              <label htmlFor="sinopse" className="block text-sm font-medium text-gray-300">Sinopse / Descrição</label>
              <textarea id="sinopse" value={sinopse} onChange={(e) => setSinopse(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={onClose} className="mr-2 py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-slate-700 focus:outline-none">Cancelar</button>
              <button type="submit" className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors">Salvar Recurso</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
