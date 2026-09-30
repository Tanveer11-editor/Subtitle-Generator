import React from 'react';
import { useEditorStore, WordData } from '@/store/editorStore';

export default function CaptionRenderer() {
  const { captions, currentTime, activeStyleId, activeAnimationId } = useEditorStore();

  const currentCaption = captions.find(c => currentTime >= c.start && currentTime <= c.end);

  if (!currentCaption) return null;

  // Simple rendering logic for now. 
  // In a full engine, we'd apply Framer Motion variants based on activeAnimationId
  // and CSS classes based on activeStyleId.

  return (
    <div className="absolute bottom-24 left-0 w-full text-center px-8 z-10 pointer-events-none">
      <div 
        className="inline-block bg-black/80 backdrop-blur-md px-6 py-3 rounded-xl shadow-2xl"
        style={{
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
          {currentCaption.words.map((word, i) => {
            const isSpoken = currentTime >= word.start;
            const isCurrentlySpoken = currentTime >= word.start && currentTime <= word.end;
            
            // Default "Karaoke" style simulation
            return (
              <span 
                key={i}
                className="font-bold text-3xl font-sans"
                style={{
                  color: isCurrentlySpoken ? '#007AFF' : isSpoken ? '#FFFFFF' : '#8E8E93',
                  transform: isCurrentlySpoken ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'inline-block',
                  textShadow: isCurrentlySpoken ? '0 0 20px rgba(0,122,255,0.5)' : 'none'
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
