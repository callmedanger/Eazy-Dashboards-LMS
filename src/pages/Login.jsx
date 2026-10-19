import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Lock, Mail, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('eazy_auth_token', 'demo_token_authenticated');
      toast.success('Welcome back, Admin! Access granted.');
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-[#060E1F] text-[#0F172A] dark:text-[#E6ECF7] transition-colors duration-200 relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#2F6FDE]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#1E4A94]/15 blur-3xl pointer-events-none" />

      {/* Top Bar for Theme Toggle */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-[#1B2C4D] bg-white dark:bg-[#0D1B34] text-slate-600 dark:text-slate-300 shadow-sm hover:scale-105 transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-900" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-xl p-8 sm:p-10 transition-all">
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0B2A5B] flex items-center justify-center text-white shadow-lg shadow-blue-950/20 mb-3">
              <School className="w-7 h-7 text-[#2F6FDE]" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Eazy School Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-1">
              Admin Portal • Institutional Control Center
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@school.edu.pk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-[#2F6FDE] hover:underline cursor-pointer">
                  Demo auto-filled
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE] transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8FA3C4] pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#2F6FDE] focus:ring-[#2F6FDE]" />
                <span>Keep session active</span>
              </label>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 shadow-md shadow-blue-900/20 transition-all duration-200 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Info Pill */}
          <div className="mt-6 p-3 rounded-2xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-center text-xs text-slate-500 dark:text-[#8FA3C4]">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Live Demo Mode Active</p>
            <p className="text-[11px] mt-0.5">Click Sign In to access the complete interactive school admin portal.</p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Powered by <strong className="text-slate-600 dark:text-slate-300">Eazy Dashboards</strong> • High-Performance SaaS
        </p>
      </div>
    </div>
  );
};
