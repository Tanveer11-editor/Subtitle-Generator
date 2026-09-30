import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import CaptionRenderer from '@/components/editor/CaptionRenderer';

export default function VideoPreview() {
  const { mediaUrl, isPlaying, currentTime, setCurrentTime, captions } = useEditorStore();
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

  if (!mediaUrl) {
    return (
      <div className="aspect-[9/16] h-full max-h-[80vh] bg-black rounded-lg shadow-2xl overflow-hidden relative flex items-center justify-center border border-border/20">
        <span className="text-white/20 font-mono text-sm">No Media Loaded</span>
      </div>
    );
  }

  return (
    <div className="aspect-[9/16] h-full max-h-[80vh] bg-black rounded-lg shadow-2xl overflow-hidden relative flex flex-col items-center justify-center border border-border/20">
      <video 
        ref={videoRef}
        src={mediaUrl} 
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        playsInline
      />
      
      <CaptionRenderer />
    </div>
  );
}
