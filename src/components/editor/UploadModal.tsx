import React, { useCallback, useState } from 'react';
import { Upload, X, Film, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editorStore';

export default function UploadModal({ onUpload }: { onUpload?: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { setMedia } = useEditorStore();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setFile(file);
    // Create object URL and get duration
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('audio') ? 'audio' : 'video';
    
    // Quick duration fetch
    const media = document.createElement(type);
    media.src = url;
    media.onloadedmetadata = () => {
      setMedia(url, type, media.duration);
      if (onUpload) onUpload();
    };
  };

  return (
    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">New Project</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><X className="h-4 w-4" /></Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept="video/*,audio/*,.mkv,.avi,.ts,.mts,.m2ts,.flv,.ogg,.flac"
              onChange={handleChange}
            />
            
            <div className="bg-secondary p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Drop your video or audio here</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              MP4, MOV, MKV, AVI, WebM, MP3, WAV, M4A and more
            </p>
            
            <div className="flex gap-4">
              <Button type="button" onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload')?.click(); }}>
                Browse Files
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Speaker Language</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="auto">Auto Detect</option>
                <option value="ta">Tamil</option>
                <option value="en">English</option>
                <option value="te">Telugu</option>
                <option value="hi">Hindi</option>
                <option value="ml">Malayalam</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Output Mode</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="romanized">Romanized (Tanglish)</option>
                <option value="original">Original Script (Tamil)</option>
                <option value="translated">Translated English</option>
              </select>
            </div>
          </div>
          
          {file && (
            <div className="bg-secondary/50 p-3 rounded-lg border border-border flex items-center gap-3">
              {file.type.startsWith('audio') ? <FileAudio className="h-8 w-8 text-emerald-500" /> : <Film className="h-8 w-8 text-blue-500" />}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <Button size="sm" onClick={() => {
                const { setCaptions } = useEditorStore.getState();
                setCaptions([
                  {
                    id: '1',
                    text: 'Bro naan office ku late ah vandhuten',
                    start: 0,
                    end: 2.5,
                    words: [
                      { text: 'Bro', start: 0, end: 0.5 },
                      { text: 'naan', start: 0.5, end: 1.0 },
                      { text: 'office', start: 1.0, end: 1.5 },
                      { text: 'ku', start: 1.5, end: 1.8 },
                      { text: 'late', start: 1.8, end: 2.0 },
                      { text: 'ah', start: 2.0, end: 2.2 },
                      { text: 'vandhuten', start: 2.2, end: 2.5 },
                    ]
                  },
                  {
                    id: '2',
                    text: 'Indha video semma useful ah irukkum',
                    start: 2.5,
                    end: 5.0,
                    words: [
                      { text: 'Indha', start: 2.5, end: 3.0 },
                      { text: 'video', start: 3.0, end: 3.5 },
                      { text: 'semma', start: 3.5, end: 4.0 },
                      { text: 'useful', start: 4.0, end: 4.5 },
                      { text: 'ah', start: 4.5, end: 4.7 },
                      { text: 'irukkum', start: 4.7, end: 5.0 },
                    ]
                  }
                ]);
                if (onUpload) onUpload();
              }}>Generate Captions</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
