import { cloneElement, useState, type ReactElement, type ReactNode } from 'react';
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
  Plus
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');

  const handleNewProject = () => {
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
            <NavItem icon={<LayoutDashboard />} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
            <NavItem icon={<FolderOpen />} label="Projects" active={activeTab === 'Projects'} onClick={() => setActiveTab('Projects')} />
            <NavItem icon={<Film />} label="Media Library" active={activeTab === 'Media Library'} onClick={() => setActiveTab('Media Library')} />
            <NavItem icon={<Type />} label="Templates" active={activeTab === 'Templates'} onClick={() => setActiveTab('Templates')} />
            <NavItem icon={<Palette />} label="Caption Styles" active={activeTab === 'Caption Styles'} onClick={() => setActiveTab('Caption Styles')} />
            <NavItem icon={<Download />} label="Exports" active={activeTab === 'Exports'} onClick={() => setActiveTab('Exports')} />
            <NavItem icon={<Settings />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
          </nav>
        </div>

        <div className="p-4 border-t border-border space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => document.documentElement.classList.toggle('light')}
          >
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
        {activeTab === 'Home' && (
          <>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </>
        )}

        {activeTab === 'Projects' && (
          <div className="p-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        )}

        {activeTab === 'Media Library' && (
          <div className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Media Library</h2>
              <Button onClick={() => document.getElementById('media-upload')?.click()}>
                <Plus className="h-4 w-4 mr-2" /> Upload Media
              </Button>
              <input type="file" id="media-upload" className="hidden" multiple accept="video/*,audio/*" />
            </div>
            
            <div className="flex flex-col items-center justify-center h-[400px] border border-border border-dashed rounded-xl bg-card/50">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No media uploaded yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm text-center">
                Upload video or audio files here to reuse them across all your projects.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Caption Styles' && (
          <div className="p-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">Text Animation Presets</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {['Karaoke Highlight', 'Pop Bounce', 'Typewriter', 'Fading Words', 'Netflix Standard', 'Bold Word-by-Word', 'TikTok Default', 'Spring Reveal'].map((style, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 cursor-pointer transition-all hover:shadow-md h-40">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-3">Abc</span>
                  <p className="font-medium text-sm">{style}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Exports' && (
          <div className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Export History</h2>
              <div className="px-4 py-2 bg-secondary rounded-md text-sm font-medium">
                Total Exports: <span className="text-primary ml-1">0</span>
              </div>
            </div>
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4">Project Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      No exports have been made yet. Finish a project and export it to see details here.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="p-10 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">Settings</h2>
            
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 border-b border-border pb-4">Profile Settings</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Display Name</label>
                    <input type="text" defaultValue="Creator" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                    <input type="email" defaultValue="creator@example.com" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                  </div>
                  <Button className="mt-2">Save Profile</Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 border-b border-border pb-4">Default Export Preferences</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Resolution</label>
                    <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                      <option>1080p (FHD)</option>
                      <option>4K (UHD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Format</label>
                    <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                      <option>MP4</option>
                      <option>MOV</option>
                    </select>
                  </div>
                  <Button className="mt-2">Update Preferences</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Templates' || activeTab === 'Help' ? (
          <div className="flex-1 flex items-center justify-center p-10 text-center">
            <div className="max-w-md">
              <div className="h-20 w-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'Templates' && <Type className="h-10 w-10 text-muted-foreground" />}
                {activeTab === 'Help' && <HelpCircle className="h-10 w-10 text-muted-foreground" />}
              </div>
              <h2 className="text-2xl font-bold mb-2">{activeTab}</h2>
              <p className="text-muted-foreground mb-8">
                This section is currently under development. Check back soon for updates.
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        active 
          ? "bg-foreground text-background shadow-sm" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {cloneElement(icon as ReactElement, { className: "h-4 w-4" } as any)}
      {label}
    </button>
  );
}


