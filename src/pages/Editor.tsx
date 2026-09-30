import { useState, useEffect, cloneElement, type ReactElement, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  Undo2,
  Redo2,
  Save,
  Download,
  Settings2,
  Type,
  Wand2
} from 'lucide-react';

import UploadModal from '@/components/editor/UploadModal';
import VideoPreview from '@/components/editor/VideoPreview';
import Timeline from '@/components/editor/Timeline';
import ExportModal from '@/components/editor/ExportModal';
import { useEditorStore } from '@/store/editorStore';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('style');
  const [showExport, setShowExport] = useState(false);
  const { mediaUrl, captions, reset, id: storeId } = useEditorStore();

  useEffect(() => {
    if (id && storeId !== id) {
      reset();
      useEditorStore.setState({ id });
    }
  }, [id, storeId, reset]);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {!mediaUrl && <UploadModal onUpload={() => {
        // Triggered after media is loaded. Wait to add captions.
      }} />}
      
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="h-4 w-[1px] bg-border mx-2"></div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">New Project</span>
            <span className="text-[10px] text-muted-foreground mt-1">Saved 2m ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="h-4 w-[1px] bg-border mx-2"></div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button 
            size="sm" 
            className="gap-2 ml-2 shadow-sm shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowExport(true)}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Transcript Panel */}
        <aside className="w-80 border-r border-border bg-card flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Captions</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {captions.length === 0 ? (
               <div className="text-center text-muted-foreground text-sm mt-10">No captions generated yet.</div>
            ) : (
               captions.map((cap, index) => (
                 <CaptionCard key={cap.id} num={index + 1} start={cap.start.toFixed(2)} text={cap.text} />
               ))
            )}
          </div>
        </aside>

        {/* CENTER: Video Preview Workspace */}
        <main className="flex-1 bg-[#111111] flex flex-col relative overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-6 pb-2">
            <VideoPreview />
          </div>
        </main>

        {/* RIGHT: Inspector Panel */}
        <aside className="w-80 border-l border-border bg-card flex flex-col flex-shrink-0">
          <div className="flex border-b border-border">
            <InspectorTab active={activeTab === 'style'} onClick={() => setActiveTab('style')} icon={<Type />} label="Style" />
            <InspectorTab active={activeTab === 'animation'} onClick={() => setActiveTab('animation')} icon={<Wand2 />} label="Animation" />
            <InspectorTab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings2 />} label="Settings" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'style' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-12 rounded border-2 border-primary bg-background flex items-center justify-center font-bold text-sm">Bold Pop</div>
                    <div className="h-12 rounded border border-border bg-background flex items-center justify-center font-serif text-sm">Minimal</div>
                    <div className="h-12 rounded border border-border bg-background flex items-center justify-center font-mono text-sm bg-yellow-400 text-black">Karaoke</div>
                    <div className="h-12 rounded border border-border bg-background flex items-center justify-center font-bold text-sm text-primary shadow-sm">Modern</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Typography</h4>
                  <div className="space-y-3">
                    <div className="h-9 border border-input rounded-md flex items-center px-3 text-sm bg-background">
                      Inter (Default)
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 border border-input rounded-md flex items-center justify-center flex-1 font-bold bg-secondary/50">B</div>
                      <div className="h-9 border border-input rounded-md flex items-center justify-center flex-1 italic">I</div>
                      <div className="h-9 border border-input rounded-md flex items-center justify-center flex-1 underline">U</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'animation' && (
              <div className="space-y-6">
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Motion Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded border border-border bg-background flex items-center justify-center text-sm">Pop In</div>
                  <div className="h-16 rounded border border-border bg-background flex items-center justify-center text-sm">Slide Up</div>
                  <div className="h-16 rounded border border-border bg-background flex items-center justify-center text-sm">Typewriter</div>
                  <div className="h-16 rounded border border-border bg-background flex items-center justify-center text-sm">Spring</div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* BOTTOM: Timeline */}
      <Timeline />
    </div>
  );
}

function InspectorTab({ active, icon, label, onClick }: { active: boolean, icon: ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
        active 
          ? "border-primary text-primary bg-background" 
          : "border-transparent text-muted-foreground hover:bg-secondary/50"
      }`}
    >
      {cloneElement(icon as ReactElement, { className: "h-4 w-4" } as any)}
      {label}
    </button>
  );
}

function CaptionCard({ num, start, text, active = false }: { num: number, start: string, text: string, active?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border text-sm cursor-pointer transition-all ${
      active 
        ? "bg-primary/5 border-primary shadow-sm" 
        : "bg-background border-border hover:border-primary/40 hover:bg-muted/30"
    }`}>
      <div className="flex justify-between items-center mb-1.5 text-xs text-muted-foreground">
        <span className="font-mono bg-secondary px-1.5 rounded text-[10px]">[{num.toString().padStart(2, '0')}]</span>
        <span className="font-mono">{start}</span>
      </div>
      <p className={`font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{text}</p>
    </div>
  );
}
