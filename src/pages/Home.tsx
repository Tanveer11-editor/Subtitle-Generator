import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FolderOpen,
  Film,
  Type,
  Palette,
  Download,
  Settings,
  HelpCircle,
  SunMoon,
  Plus,
  MoreVertical,
  Clock,
  MonitorPlay
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const handleNewProject = () => {
    // In a real app we would create a project ID in the store/db first
    const newProjectId = "proj_" + Math.random().toString(36).substring(7);
    navigate(`/editor/${newProjectId}`);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary p-2 rounded-lg">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CaptionFlow AI</h1>
          </div>
          
          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard />} label="Home" active />
            <NavItem icon={<FolderOpen />} label="Projects" />
            <NavItem icon={<Film />} label="Media Library" />
            <NavItem icon={<Type />} label="Templates" />
            <NavItem icon={<Palette />} label="Caption Styles" />
            <NavItem icon={<Download />} label="Exports" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </div>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <SunMoon className="h-4 w-4 mr-3" /> Theme
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <HelpCircle className="h-4 w-4 mr-3" /> Help
          </Button>
          <div className="flex items-center gap-3 px-3 py-2 mt-4 hover:bg-secondary rounded-md cursor-pointer transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              C
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Creator</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-10 pt-12 pb-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Good afternoon, Creator 👋</h2>
          <p className="text-muted-foreground mt-2 text-lg">Create professional captions in seconds.</p>
        </header>

        <div className="px-10 py-6">
          <Button size="lg" onClick={handleNewProject} className="rounded-full shadow-lg shadow-primary/25 h-14 px-8 text-base">
            <Plus className="mr-2 h-5 w-5" /> New Project
          </Button>
        </div>

        <div className="px-10 py-8 mt-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Projects</h3>
          </div>
          
          {/* Empty State or Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProjectCard title="Vlog_01_Draft" duration="04:20" lastEdited="2 hours ago" />
            <ProjectCard title="Instagram Reel Motivation" duration="00:59" lastEdited="Yesterday" />
            
            {/* Create First Project Empty State Card */}
            <div 
              onClick={handleNewProject}
              className="flex flex-col items-center justify-center h-[240px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-muted-foreground hover:text-primary group"
            >
              <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/10 mb-4 transition-colors">
                <Plus className="h-8 w-8" />
              </div>
              <p className="font-medium">Create your first project</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        active 
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" })}
      {label}
    </a>
  );
}

function ProjectCard({ title, duration, lastEdited }: { title: string, duration: string, lastEdited: string }) {
  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col">
      <div className="aspect-video bg-muted relative flex items-center justify-center">
        <MonitorPlay className="h-10 w-10 text-muted-foreground/40" />
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs px-2 py-1 rounded font-medium">
          {duration}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between bg-card">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-foreground truncate pr-4">{title}</h4>
            <button className="text-muted-foreground hover:text-foreground p-1 -mr-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-2 gap-3">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lastEdited}</span>
            <span>• 1080x1920</span>
          </div>
        </div>
      </div>
    </div>
  );
}
