import React, { useRef, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { 
  Layers, Film, Type, Music, 
  MousePointer2, Trash2, Undo2, Redo2, 
  SplitSquareHorizontal, Magnet, ZoomIn, ZoomOut,
  Eye, Lock, Mic
} from 'lucide-react';


export default function Timeline() {
  const { captions, duration, currentTime, setCurrentTime } = useEditorStore();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);

  const pixelsPerSecond = zoom;
  // Make timeline wider than just the duration for extra scrolling space
  const timelineWidth = Math.max((duration || 30) * pixelsPerSecond + 500, 1500);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft;
    // Left sidebar is 100px wide (w-24 approx), but we are attaching click to the scrollable area
    const clickX = e.clientX - rect.left + scrollLeft;
    const newTime = clickX / pixelsPerSecond;
    setCurrentTime(Math.max(0, Math.min(newTime, duration || 30)));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 30); // Approximate frame (30fps)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  // Generate ruler markers
  const renderRuler = () => {
    const markers = [];
    const totalSeconds = Math.ceil(timelineWidth / pixelsPerSecond);
    
    for (let i = 0; i <= totalSeconds; i++) {
      // Major marker every 5 seconds, minor every 1 second
      const isMajor = i % 5 === 0;
      markers.push(
        <div 
          key={i} 
          className="absolute bottom-0 flex flex-col items-center pointer-events-none"
          style={{ left: `${i * pixelsPerSecond}px`, transform: 'translateX(-50%)' }}
        >
          {isMajor && <span className="text-[10px] text-muted-foreground/70 font-mono mb-1">{formatTime(i)}</span>}
          <div className={`w-px bg-border/60 ${isMajor ? 'h-3' : 'h-1.5'}`}></div>
        </div>
      );
    }
    return markers;
  };

  return (
    <footer className="h-[340px] bg-[#1a1a1a] border-t border-black flex flex-col flex-shrink-0 relative z-10 text-gray-300">
      
      {/* Top Tabs */}
      <div className="h-9 flex items-center bg-[#1e1e1e] border-b border-[#2a2a2a] px-2 text-xs">
        <div className="flex items-center h-full px-4 bg-[#2a2a2a] text-white rounded-t-sm border-t border-x border-[#333] relative">
          <Film className="h-3.5 w-3.5 mr-2 text-primary" />
          Timeline 01
          <div className="absolute top-0 right-0 h-full w-4 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
            <span className="text-[10px]">×</span>
          </div>
        </div>
        <div className="flex items-center h-full px-4 text-gray-400 hover:text-gray-200 cursor-pointer">
          Timeline 02
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-10 flex items-center justify-between px-3 bg-[#1e1e1e] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-1">
          <ToolbarButton icon={<MousePointer2 className="h-4 w-4" />} active />
          <ToolbarButton icon={<SplitSquareHorizontal className="h-4 w-4" />} />
          <div className="w-px h-4 bg-[#333] mx-1"></div>
          <ToolbarButton icon={<Undo2 className="h-4 w-4" />} disabled />
          <ToolbarButton icon={<Redo2 className="h-4 w-4" />} disabled />
          <div className="w-px h-4 bg-[#333] mx-1"></div>
          <ToolbarButton icon={<Trash2 className="h-4 w-4" />} />
          <div className="w-px h-4 bg-[#333] mx-1"></div>
          <ToolbarButton icon={<Magnet className="h-4 w-4 text-blue-400" />} active />
          <ToolbarButton icon={<Layers className="h-4 w-4 text-blue-400" />} active />
        </div>
        <div className="flex items-center gap-3">
          <ToolbarButton icon={<Mic className="h-4 w-4" />} />
          <div className="flex items-center gap-2 px-2">
            <ZoomOut className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-300" onClick={() => setZoom(Math.max(50, zoom - 20))} />
            <input 
              type="range" 
              min="50" max="200" 
              value={zoom} 
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24 h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-300" onClick={() => setZoom(Math.min(200, zoom + 20))} />
          </div>
        </div>
      </div>
      
      {/* Timeline Area (Sidebar + Tracks) */}
      <div className="flex-1 flex overflow-hidden bg-[#141414]">
        
        {/* Track Headers (Left Sidebar) */}
        <div className="w-[120px] bg-[#1e1e1e] border-r border-[#2a2a2a] flex flex-col pt-8 pb-4 space-y-1 z-20 flex-shrink-0 overflow-y-hidden">
          <TrackHeader icon={<Type className="h-3 w-3" />} label="TI" />
          <TrackHeader icon={<Layers className="h-3 w-3" />} label="FX" />
          <TrackHeader icon={<Layers className="h-3 w-3" />} label="FX" />
          <TrackHeader icon={<Film className="h-3 w-3" />} label="V1" main />
          <TrackHeader icon={<Music className="h-3 w-3" />} label="A1" />
        </div>

        {/* Tracks Area (Scrollable) */}
        <div 
          ref={timelineRef}
          className="flex-1 overflow-auto relative flex flex-col custom-scrollbar"
        >
          <div style={{ width: `${timelineWidth}px` }} className="min-h-full relative pb-10">
            
            {/* Time ruler */}
            <div 
              className="h-8 border-b border-[#2a2a2a] bg-[#1e1e1e] sticky top-0 z-30 cursor-pointer"
              onClick={handleTimelineClick}
            >
              {renderRuler()}
            </div>
            
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-white z-40 pointer-events-none"
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[11px] h-[14px] bg-white rounded-b-sm shadow-[0_0_4px_rgba(0,0,0,0.5)]">
                <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-px h-2 bg-black/30"></div>
              </div>
            </div>

            <div className="relative pt-1 space-y-1">
              
              {/* Text Track (Captions) */}
              <div className="h-8 flex items-center relative group">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 pointer-events-none"></div>
                {captions.map((cap) => {
                  const isActive = currentTime >= cap.start && currentTime <= cap.end;
                  return (
                    <div 
                      key={cap.id}
                      className={`absolute h-7 rounded-sm flex items-center px-2 cursor-pointer border shadow-sm overflow-hidden ${
                        isActive 
                          ? 'bg-[#c54b3c] border-[#ff7866] text-white z-10' 
                          : 'bg-[#98382b] border-[#bf4735] text-white/90 hover:brightness-110'
                      }`}
                      style={{ 
                        left: `${cap.start * pixelsPerSecond}px`, 
                        width: `${Math.max((cap.end - cap.start) * pixelsPerSecond, 20)}px` 
                      }}
                      onClick={() => setCurrentTime(cap.start)}
                    >
                      <span className="text-[10px] font-medium truncate">{cap.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Effects Track 1 */}
              <div className="h-8 flex items-center relative group">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 pointer-events-none"></div>
                {duration > 0 && (
                  <div className="absolute h-7 bg-[#5b4d9c] border border-[#7a6ac4] rounded-sm flex items-center px-2 text-[10px] text-white overflow-hidden shadow-sm" style={{ left: 0, width: Math.max(duration * pixelsPerSecond * 0.8, 100) }}>
                    <Layers className="h-3 w-3 mr-1 opacity-70" /> Golden Nightglow
                  </div>
                )}
              </div>

              {/* Effects Track 2 */}
              <div className="h-8 flex items-center relative group">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 pointer-events-none"></div>
                {duration > 0 && (
                  <>
                    <div className="absolute h-7 bg-[#6a3275] border border-[#9446a3] rounded-sm flex items-center px-1 text-[10px] text-white overflow-hidden shadow-sm" style={{ left: 0, width: 80 }}>
                      <span className="text-[9px] opacity-70 mr-1">✧</span> Blur
                    </div>
                    <div className="absolute h-7 bg-[#6a3275] border border-[#9446a3] rounded-sm flex items-center px-1 text-[10px] text-white overflow-hidden shadow-sm" style={{ left: 100, width: 60 }}>
                      <span className="text-[9px] opacity-70 mr-1">✧</span> Blur
                    </div>
                  </>
                )}
              </div>

              {/* Video Track (Main) */}
              <div className="h-14 flex items-center relative group mt-2">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 pointer-events-none"></div>
                {duration > 0 && (
                  <div className="absolute h-12 bg-[#7a2020] border border-[#aa3030] rounded-sm overflow-hidden flex flex-col justify-between" style={{ left: 0, width: duration * pixelsPerSecond }}>
                    <div className="w-full bg-[#aa3030] h-4 flex items-center px-1.5 text-[9px] font-medium text-white/90">
                      IMG_7410.MOV
                    </div>
                    <div className="flex-1 flex items-center justify-center text-[10px] text-white/60 font-medium">
                      Media lost
                    </div>
                    {/* Fake film reel holes at bottom */}
                    <div className="h-1.5 w-full border-t border-black/20 flex gap-2 px-1">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="h-1 w-1 bg-black/40 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Audio Track */}
              <div className="h-10 flex items-center relative group mt-1">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 pointer-events-none"></div>
                {duration > 0 && (
                  <div className="absolute h-8 bg-[#1f5a3b] border border-[#2d8155] rounded-sm overflow-hidden flex items-center relative" style={{ left: 0, width: duration * pixelsPerSecond }}>
                    <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wLDUwIEwxMCwyMCBMMjAsODAgTDMwLDQwIEw0MCw2MCBMNTAsMTAgTDYwLDkwIEw3MCwzMCBMODAsNzAgTDkwLDMwIEwxMDAsNTAiIHN0cm9rZT0iIzZmY2I5NiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L3N2Zz4=')] bg-repeat-x bg-[length:50px_100%]"></div>
                    <span className="text-[9px] text-white/80 ml-2 z-10 truncate">vidssave.com @SaiAbhyankkar...</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ToolbarButton({ icon, active, disabled }: { icon: React.ReactNode, active?: boolean, disabled?: boolean }) {
  return (
    <button 
      className={`h-7 w-7 rounded flex items-center justify-center transition-colors
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-[#333]'}
        ${active && !disabled ? 'bg-[#333] text-white' : 'text-gray-400'}
      `}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}

function TrackHeader({ icon, label, main }: { icon?: React.ReactNode, label: string, main?: boolean }) {
  return (
    <div className={`h-8 flex items-center justify-between px-2 w-full group ${main ? 'h-14 mt-2' : ''}`}>
      <div className="flex items-center gap-1.5 text-gray-500">
        {icon}
        <span className="w-4 flex justify-center text-[10px] font-bold">{label}</span>
        <button className="hover:text-gray-300 opacity-50 group-hover:opacity-100"><Lock className="h-3 w-3" /></button>
        <button className="hover:text-gray-300 opacity-50 group-hover:opacity-100"><Eye className="h-3 w-3" /></button>
      </div>
    </div>
  );
}
