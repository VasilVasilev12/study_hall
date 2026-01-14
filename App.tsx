import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { AdminPanel } from './components/AdminPanel';
import { User, StudyFile, CalendarEvent, ViewState } from './types';
import { INITIAL_USERS, INITIAL_FILES, INITIAL_EVENTS } from './services/mockData';

function App() {
  // --- STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('login');
  
  // Simulated Database
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [files, setFiles] = useState<StudyFile[]>(INITIAL_FILES);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

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
    // In a browser-only environment, we create a blob URL to simulate "hosting"
    const newFile: StudyFile = {
      id: Date.now().toString(),
      name: file.name,
      category: 'Assignment', // Default, usually user would select this
      uploadDate: new Date().toISOString(),
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: URL.createObjectURL(file),
      type: file.type
    };
    setFiles(prev => [newFile, ...prev]);
  };

  const handleDeleteFile = (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
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
    if (confirm('Delete this user account?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // --- RENDER ---

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