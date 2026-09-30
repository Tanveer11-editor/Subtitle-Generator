import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Scissors, Layers, Film, Type, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Timeline() {
  const { captions, duration, currentTime, setCurrentTime, isPlaying, setIsPlaying } = useEditorStore();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1); // 1 = 100px per second

  const pixelsPerSecond = 100 * zoom;
  const timelineWidth = Math.max(duration * pixelsPerSecond, 1000);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const newTime = clickX / pixelsPerSecond;
    setCurrentTime(Math.max(0, Math.min(newTime, duration)));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-64 border-t border-border bg-card flex flex-col flex-shrink-0 relative z-10">
      <div className="h-10 border-b border-border flex items-center px-4 justify-between bg-muted/30">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7"><Scissors className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7"><Layers className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
      
      <div 
        ref={timelineRef}
        className="flex-1 overflow-x-auto overflow-y-hidden bg-background relative flex flex-col cursor-text select-none"
        onClick={handleTimelineClick}
      >
        <div style={{ width: `${timelineWidth}px` }} className="h-full relative">
          {/* Time ruler */}
          <div className="h-6 border-b border-border/50 bg-muted/20 flex relative">
            <div className="absolute top-0 left-0 h-full w-full opacity-50" style={{ backgroundImage: 'linear-gradient(90deg, var(--color-border) 1px, transparent 1px)', backgroundSize: `${pixelsPerSecond}px 100%` }}></div>
          </div>
          
          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-primary z-20 pointer-events-none"
            style={{ left: `${currentTime * pixelsPerSecond}px` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary"></div>
          </div>

          <div className="flex-1 relative py-2 space-y-1">
            {/* Video Track */}
            <div className="h-12 bg-muted/30 flex items-center border-y border-border/50 relative">
              <div className="w-20 absolute left-0 z-30 h-full bg-card/80 backdrop-blur border-r border-border flex-shrink-0 text-[10px] text-muted-foreground font-medium flex items-center px-2 gap-1.5"><Film className="h-3 w-3" /> VIDEO</div>
              {duration > 0 && (
                <div className="absolute h-8 bg-blue-500/20 border border-blue-500/40 rounded flex items-center px-2 overflow-hidden pointer-events-none" style={{ left: 0, width: duration * pixelsPerSecond }}>
                  <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 truncate sticky left-24">Media Source</span>
                </div>
              )}
            </div>

            {/* Captions Track */}
            <div className="h-10 bg-muted/30 flex items-center border-b border-border/50 relative">
              <div className="w-20 absolute left-0 z-30 h-full bg-card/80 backdrop-blur border-r border-border flex-shrink-0 text-[10px] text-muted-foreground font-medium flex items-center px-2 gap-1.5"><Type className="h-3 w-3" /> SUBS</div>
              
              {/* Caption Blocks */}
              {captions.map((cap) => {
                const isActive = currentTime >= cap.start && currentTime <= cap.end;
                return (
                  <div 
                    key={cap.id}
                    className={`absolute h-6 rounded flex items-center px-1.5 cursor-pointer shadow-sm border ${
                      isActive 
                        ? 'bg-primary/90 text-primary-foreground border-primary' 
                        : 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30'
                    }`}
                    style={{ 
                      left: `${cap.start * pixelsPerSecond}px`, 
                      width: `${(cap.end - cap.start) * pixelsPerSecond}px` 
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTime(cap.start);
                    }}
                  >
                    <span className={`text-[10px] font-medium truncate ${isActive ? 'text-primary-foreground' : 'text-primary'}`}>
                      {cap.text}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Audio Track */}
            <div className="h-12 bg-muted/30 flex items-center border-b border-border/50 relative">
              <div className="w-20 absolute left-0 z-30 h-full bg-card/80 backdrop-blur border-r border-border flex-shrink-0 text-[10px] text-muted-foreground font-medium flex items-center px-2 gap-1.5"><Music className="h-3 w-3" /> AUDIO</div>
              {duration > 0 && (
                <div className="absolute h-8 bg-emerald-500/10 border border-emerald-500/30 rounded flex items-center overflow-hidden pointer-events-none" style={{ left: 0, width: duration * pixelsPerSecond }}>
                  <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wLDUwIEwxMCwyMCBMMjAsODAgTDMwLDQwIEw0MCw2MCBMNTAsMTAgTDYwLDkwIEw3MCwzMCBMODAsNzAgTDkwLDMwIEwxMDAsNTAiIHN0cm9rZT0iIzEwYjk4MSIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] bg-repeat-x bg-[length:100px_100%]"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
