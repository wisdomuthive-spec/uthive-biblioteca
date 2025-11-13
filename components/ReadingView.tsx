import React, { useEffect, useRef, useState } from 'react';
import type { Resource } from '../types';
import { ArrowLeftIcon } from './Icons';

interface ResourceViewProps {
  resource: Resource;
  onBack: () => void;
  onUpdateActivity: (progress: number, duration: number) => void;
}

export const ResourceView: React.FC<ResourceViewProps> = ({ resource, onBack, onUpdateActivity }) => {
  const [startTime] = useState(Date.now());
  // Fix: Replace NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const trackActivity = () => {
      const duration = (Date.now() - startTime) / 1000;
      let progress = 0;

      if (resource.type === 'video' || resource.type === 'audio' || resource.type === 'audiobook') {
        if (mediaRef.current && mediaRef.current.duration) {
          progress = (mediaRef.current.currentTime / mediaRef.current.duration) * 100;
        }
      } else if (resource.type === 'book') {
        if (contentRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
          if(scrollHeight - clientHeight > 0) {
              progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
          } else {
              progress = 100; // Content fits in viewport
          }
        }
      }
      onUpdateActivity(Math.min(100, progress), duration);
    };

    intervalRef.current = setInterval(trackActivity, 2000); // Update every 2 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resource.type, onUpdateActivity, startTime]);

  const renderContent = () => {
    switch(resource.type) {
      case 'video':
        return <video ref={mediaRef as React.RefObject<HTMLVideoElement>} src={resource.videoUrl} controls className="w-full max-w-4xl mx-auto rounded-lg" />;
      case 'audio':
      case 'audiobook':
        return (
          <div className="text-center">
            <img src={resource.capaUrl} alt={resource.titulo} className="w-64 h-auto mx-auto rounded-lg mb-4 shadow-lg"/>
            <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={resource.audioUrl} controls className="w-full max-w-md mx-auto" />
            {resource.type === 'audiobook' && resource.content && (
              <div ref={contentRef} className="mt-8 text-left max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg max-h-96 overflow-y-auto leading-relaxed">
                  {resource.content}
              </div>
            )}
          </div>
        )
      case 'book':
        return (
          <div ref={contentRef} className="bg-slate-800/50 rounded-lg p-8 max-w-3xl mx-auto h-[75vh] overflow-y-auto leading-relaxed" onScroll={() => { /* tracking is handled by interval */ }}>
            <p>{resource.content}</p>
          </div>
        );
      default:
        return <p>Tipo de recurso não suportado.</p>
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-white font-semibold rounded-md hover:bg-slate-700 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          Voltar ao Acervo
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-white">{resource.titulo}</h1>
          <p className="text-md text-cyan-400">{resource.autor}</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};
