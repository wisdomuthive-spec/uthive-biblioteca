import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from './Icons';

interface SectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Section: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="mb-12 bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-4">
          <div className="text-cyan-400">{icon}</div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <ChevronDownIcon
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="p-6 pt-0">
          <div className="border-t border-slate-700 pt-6">
            {children}
          </div>
        </div>
      )}
    </section>
  );
};
