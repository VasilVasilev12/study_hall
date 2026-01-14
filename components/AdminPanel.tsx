import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Shield, Trash2, Users } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  onCreateUser: (user: Omit<User, 'id'>) => void;
  onDeleteUser: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, onCreateUser, onDeleteUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (users.some(u => u.username === username)) {
      setError('Username already exists');
      return;
    }

    onCreateUser({ username, password, role, fullName });
    
    // Reset form
    setUsername('');
    setPassword('');
    setFullName('');
    setRole('student');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create User Form */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm sticky top-6">
          <div className="flex items-center space-x-2 mb-6 text-brand-500">
            <UserPlus size={24} />
            <h2 className="text-xl font-bold text-white">Create Account</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder:text-slate-600"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder:text-slate-600"
                placeholder="No emails allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
              <div className="flex gap-2 p-1 bg-slate-800 border border-slate-700 rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'student' ? 'bg-slate-700 shadow-sm text-brand-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'admin' ? 'bg-slate-700 shadow-sm text-brand-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded-md border border-red-900/50">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>

      {/* User List */}
      <div className="lg:col-span-2 space-y-6">
        <div>
           <h2 className="text-2xl font-bold text-white">User Management</h2>
           <p className="text-slate-400">View and manage system access.</p>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand-900/30 border border-brand-800 text-brand-400 flex items-center justify-center font-bold text-xs">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.fullName}</p>
                          <p className="text-xs text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'admin' ? 'bg-purple-900/20 text-purple-300 border border-purple-800/50' : 'bg-green-900/20 text-green-300 border border-green-800/50'}
                      `}>
                        {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.username !== 'admin' && (
                        <button 
                          onClick={() => onDeleteUser(user.id)}
                          className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Users size={32} className="mx-auto mb-2 opacity-30" />
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};