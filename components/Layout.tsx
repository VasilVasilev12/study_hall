import React from 'react';
import { ViewState, User } from '../types';
import { 
  Home, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu,
  GraduationCap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  user: User | null;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  user, 
  onNavigate, 
  onLogout 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    // Hide admin link if not admin
    if (view === 'admin' && user?.role !== 'admin') return null;

    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          onNavigate(view);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        }`}
      >
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-full">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-600/20">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Study Hall</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem view="dashboard" icon={Home} label="Dashboard" />
          <NavItem view="calendar" icon={Calendar} label="Schedule" />
          <NavItem view="admin" icon={Settings} label="Admin Portal" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-4 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold text-white">Study Hall</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm p-4 flex flex-col animate-in slide-in-from-top-10 duration-200">
             <div className="flex justify-between items-center mb-8">
               <span className="text-lg font-bold text-white">Menu</span>
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-800 text-slate-400 rounded-full">
                 <LogOut className="rotate-180" size={20}/>
               </button>
             </div>
             <nav className="space-y-2 flex-1">
                <NavItem view="dashboard" icon={Home} label="Dashboard" />
                <NavItem view="calendar" icon={Calendar} label="Schedule" />
                <NavItem view="admin" icon={Settings} label="Admin Portal" />
             </nav>
             <button 
                onClick={onLogout}
                className="flex items-center justify-center space-x-2 w-full px-4 py-4 bg-red-500/10 text-red-400 rounded-xl font-bold mt-4"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
          </div>
        )}

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 scroll-smooth">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};