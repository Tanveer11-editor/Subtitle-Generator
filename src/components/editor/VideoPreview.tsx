import { useRef, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import CaptionRenderer from '@/components/editor/CaptionRenderer';
import { Play, Pause, SkipBack, SkipForward, Maximize, MousePointer2, Hand, Crop } from 'lucide-react';

export default function VideoPreview() {
  const { mediaUrl, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration } = useEditorStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(e => console.error("Playback failed:", e));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only update if difference is significant to avoid seek loop
    if (Math.abs(video.currentTime - currentTime) > 0.3) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 30); // Approximate frame (30fps)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  if (!mediaUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="aspect-[9/16] h-[90%] bg-black rounded-sm shadow-xl flex items-center justify-center border border-white/10">
          <span className="text-white/20 font-medium text-sm">No Media Loaded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative text-gray-300">
      
      {/* Top Overlay Toolbar (like CapCut selection tools) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#222]/80 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10 z-10">
        <button className="p-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"><MousePointer2 className="h-4 w-4" /></button>
        <button className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Hand className="h-4 w-4" /></button>
        <button className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Crop className="h-4 w-4" /></button>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden pb-4">
        <div className="aspect-[9/16] h-full max-h-full bg-black rounded-sm shadow-xl relative flex flex-col items-center justify-center border border-white/10 overflow-hidden ring-1 ring-white/5">
          <video 
            ref={videoRef}
            src={mediaUrl} 
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            playsInline
          />
          <CaptionRenderer />
        </div>
      </div>

      {/* Playback Controls (Bottom Bar) */}
      <div className="h-12 bg-[#1a1a1a] rounded-lg border border-white/5 flex items-center justify-between px-4 shadow-lg shrink-0">
        {/* Time Display */}
        <div className="flex items-center gap-1 w-32">
          <span className="text-xs font-mono text-white/90">{formatTime(currentTime)}</span>
          <span className="text-xs font-mono text-white/40">/</span>
          <span className="text-xs font-mono text-white/40">{formatTime(duration)}</span>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-4">
          <button 
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            onClick={() => setCurrentTime(Math.max(0, currentTime - 0.1))}
          >
            <SkipBack className="h-4 w-4" />
          </button>
          
          <button 
            className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95 shadow-md"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
          </button>

          <button 
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 0.1))}
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 w-32 justify-end">
          <div className="flex items-center bg-[#2a2a2a] rounded px-2 py-1">
            <span className="text-[10px] font-medium text-white/70">Fit</span>
          </div>
          <button className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
      
    </div>
  );
}
