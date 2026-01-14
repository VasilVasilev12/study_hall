import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { AdminPanel } from './components/AdminPanel';
import { User, StudyFile, CalendarEvent, ViewState } from './types';
import { INITIAL_USERS, INITIAL_FILES, INITIAL_EVENTS } from './services/mockData';

function App() {
  // --- STATE WITH PERSISTENCE ---
  
  // Helper to load from localStorage with fallback
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error('Failed to load state', e);
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadState('sh_users', INITIAL_USERS));
  const [files, setFiles] = useState<StudyFile[]>(() => loadState('sh_files', INITIAL_FILES));
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    // Dates need to be revived from strings
    const saved = loadState('sh_events', INITIAL_EVENTS);
    return saved.map((e: any) => ({
      ...e,
      date: new Date(e.date)
    }));
  });

  // Persist State Changes
  useEffect(() => { localStorage.setItem('sh_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('sh_files', JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem('sh_events', JSON.stringify(events)); }, [events]);

  // Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('sh_session_user', null));
  const [currentView, setCurrentView] = useState<ViewState>(() => loadState('sh_view', 'login'));

  // Persist Session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sh_session_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sh_session_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sh_view', currentView);
  }, [currentView]);

  // --- HANDLERS ---

  // Auth
  const handleLogin = async (username: string, pass: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  // Files
  const handleUpload = (file: File) => {
    const newFile: StudyFile = {
      id: Date.now().toString(),
      name: file.name,
      category: 'Assignment', 
      uploadDate: new Date().toISOString(),
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: URL.createObjectURL(file), // Note: Blob URLs do not persist across reloads well in a real app without backend, but local state simulates it.
      type: file.type
    };
    setFiles(prev => [newFile, ...prev]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Events
  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleToggleEventComplete = (id: string) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, completed: !e.completed } : e
    ));
  };

  // Users (Admin Only)
  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (id: string) => {
    // Removed window.confirm to ensure the action works reliably in all environments
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // --- RENDER ---

  if (!currentUser && currentView !== 'login') {
    // Redirect to login if session is invalid
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      user={currentUser} 
      onNavigate={setCurrentView}
      onLogout={handleLogout}
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          files={files} 
          onUpload={handleUpload} 
          onDelete={handleDeleteFile}
        />
      )}
      
      {currentView === 'calendar' && (
        <CalendarView 
          events={events}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          onToggleComplete={handleToggleEventComplete}
        />
      )}

      {currentView === 'admin' && (
        <AdminPanel 
          users={users}
          onCreateUser={handleCreateUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </Layout>
  );
}

export default App;