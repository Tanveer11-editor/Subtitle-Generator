import { useState } from 'react';
import { X, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExportModal({ onClose }: { onClose: () => void }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setStatus('Preparing video...');
    
    // Simulate export process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5;
      
      if (currentProgress < 30) {
        setStatus('Preparing video...');
      } else if (currentProgress < 60) {
        setStatus('Rendering captions...');
      } else if (currentProgress < 90) {
        setStatus('Encoding video...');
      } else {
        setStatus('Finalizing...');
      }
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsComplete(true);
        setStatus('Export complete ✓');
      }
      
      setProgress(Math.min(currentProgress, 100));
    }, 200);
  };

  return (
    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-xl rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <h2 className="text-xl font-bold">Export Project</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          {!isExporting && !isComplete ? (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Format</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option>MP4 Video</option>
                      <option>MOV Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Resolution</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option>1080p (FHD)</option>
                      <option>720p (HD)</option>
                      <option>1440p (2K)</option>
                      <option>4K (UHD)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Frame Rate</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option>30 fps</option>
                      <option>60 fps</option>
                      <option>24 fps (Original)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Captions</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option>Burn into video</option>
                      <option>Export SRT only</option>
                      <option>Export VTT only</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Estimated File Size</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Based on 1080p 30fps</p>
                </div>
                <span className="font-mono font-bold text-lg">~45 MB</span>
              </div>
              
              <Button size="lg" className="w-full h-12 text-base font-semibold" onClick={handleExport}>
                <Download className="mr-2 h-5 w-5" /> Export Video
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              {isComplete ? (
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              ) : (
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-xs">{Math.round(progress)}%</span>
                </div>
              )}
              
              <div className="text-center space-y-2 w-full max-w-sm">
                <h3 className="text-lg font-bold">{status}</h3>
                
                {!isComplete && (
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {isComplete && (
                <div className="flex gap-4 pt-4 w-full">
                  <Button className="flex-1" onClick={onClose}>Done</Button>
                  <Button variant="outline" className="flex-1">
                    Download SRT
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
