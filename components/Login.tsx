import React, { useState } from 'react';
import { LogIn, GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Strict username check (no @ symbol as requested "No emails")
    if (username.includes('@')) {
      setError('Emails are not allowed. Please use your username.');
      return;
    }

    setLoading(true);
    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Invalid credentials. If you forgot your password, ask the admin.');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900 to-slate-950 rounded-b-[4rem] z-0 opacity-50" />
       
       <div className="relative z-10 w-full max-w-md">
         <div className="text-center mb-8">
           <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl mx-auto flex items-center justify-center shadow-xl mb-4">
             <GraduationCap size={40} className="text-brand-500" />
           </div>
           <h1 className="text-4xl font-bold text-white tracking-tight">Study Hall</h1>
           <p className="text-brand-200 mt-2 text-lg">Your academic companion</p>
         </div>

         <div className="bg-slate-900 rounded-2xl shadow-xl shadow-black/50 p-8 border border-slate-800">
           <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             <div>
               <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-white placeholder:text-slate-500"
                 placeholder="Enter your username"
                 required
               />
               <p className="text-xs text-slate-500 mt-1 pl-1">Emails are not allowed</p>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-white placeholder:text-slate-500"
                 placeholder="••••••••"
                 required
               />
             </div>

             {error && (
               <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg border border-red-900/50 flex items-center">
                 <span className="mr-2">⚠️</span> {error}
               </div>
             )}

             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-70"
             >
               {loading ? (
                 <span>Signing in...</span>
               ) : (
                 <>
                   <span>Sign In</span>
                   <LogIn size={20} />
                 </>
               )}
             </button>
           </form>

           <div className="mt-6 text-center text-sm text-slate-500">
             Need an account? Contact the System Admin.
           </div>
         </div>
       </div>

       <div className="fixed bottom-4 text-xs text-slate-600">
         Study Hall v1.0 • Local Host Environment
       </div>
    </div>
  );
};