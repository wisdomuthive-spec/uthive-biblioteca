import React, { useState } from 'react';
import { searchWithGemini } from '../services/geminiService';
// Fix: Use the 'Resource' type as 'Book' is not an exported member of '../types'.
import type { Resource } from '../types';
import { SearchIcon, SpinnerIcon, AlertIcon } from './Icons';

export const SmartSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  // Fix: Use the 'Resource' type as 'Book' is not an exported member of '../types'.
  const [results, setResults] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);

    try {
      const books = await searchWithGemini(query);
      setResults(books);
    } catch (err) {
      setError('Ocorreu um erro ao buscar as recomendações. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: 'Ficção científica para adolescentes'"
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <SpinnerIcon /> : 'Pesquisar com IA'}
        </button>
      </form>

      <div className="mt-8">
        {loading && (
          <div className="text-center text-gray-400">
            <p>Aguarde, a IA está buscando as melhores recomendações...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-900/50 text-red-300 p-4 rounded-md">
            <AlertIcon />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && searched && results.length === 0 && (
          <div className="text-center text-gray-400">
            <p>Nenhum resultado encontrado para sua busca. Tente outros termos.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((book, index) => (
              <div key={index} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
                <img src={book.capaUrl} alt={`Capa do livro ${book.titulo}`} className="w-full h-48 object-cover" />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white">{book.titulo}</h3>
                  <p className="text-sm text-cyan-400 mb-2">{book.autor}</p>
                  <p className="text-gray-400 text-sm flex-grow">{book.sinopse}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
