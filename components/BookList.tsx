import React, { useState } from 'react';
import type { Resource, User } from '../types';
import { ResourceCard } from './BookCard';
import { SearchIcon, BookIcon, SparklesIcon, GlobeAltIcon, RocketIcon, DocumentTextIcon } from './Icons';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Todos': <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>,
    'Ficção Científica': <RocketIcon className="w-8 h-8" />,
    'Ficção': <BookIcon className="w-8 h-8" />,
    'Ciência': <DocumentTextIcon className="w-8 h-8" />,
    'Não-Ficção': <GlobeAltIcon className="w-8 h-8" />,
    'Fantasia': <SparklesIcon className="w-8 h-8" />,
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center items-start gap-4 sm:gap-8 flex-wrap">
        {categories.map(category => {
          const isSelected = category === selectedCategory;
          const icon = categoryIcons[category] || <BookIcon className="w-8 h-8" />;

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="flex flex-col items-center justify-start gap-2 text-center group w-24 h-28"
              aria-pressed={isSelected}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-white bg-slate-800
                transition-all duration-300 transform group-hover:bg-slate-700
                ${isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-cyan-400' : ''}
              `}>
                {icon}
              </div>
              <span className={`
                font-semibold transition-colors text-sm
                ${isSelected ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}
              `}>
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


interface ResourceListProps {
  resources: Resource[];
  currentUser: User;
  onBorrow: (id: number) => void;
  onReturn: (id: number) => void;
  onOpen: (resource: Resource) => void;
  isMyResources: boolean;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources, currentUser, onBorrow, onReturn, onOpen, isMyResources, categories, selectedCategory, onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources
    .filter(resource => selectedCategory === 'Todos' || resource.category === selectedCategory)
    .filter(resource =>
        resource.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.autor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {!isMyResources && (
        <CategoryFilters 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={onSelectCategory}
        />
      )}

      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por título ou autor..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              currentUser={currentUser} 
              onBorrow={onBorrow} 
              onReturn={onReturn}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-16">
          <h3 className="text-xl">Nenhum recurso encontrado</h3>
          <p>{searchQuery ? 'Tente ajustar sua busca.' : (isMyResources ? 'Você ainda não pegou nenhum recurso.' : 'Nenhum recurso encontrado nesta categoria.')}</p>
        </div>
      )}
    </div>
  );
};
