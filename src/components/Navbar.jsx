import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Globe,
  CheckCircle,
  Calendar,
  AlertCircle,
  Clock,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';
import { useSchool } from '../context/SchoolContext';

export const Navbar = ({ onToggleSidebar, onOpenCommandPalette }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { academicYear, setAcademicYear, currentUser, notices } = useSchool();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('eazy_auth_token');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-[#1B2C4D] bg-white/95 dark:bg-[#0D1B34]/95 backdrop-blur-md px-4 sm:px-6 transition-colors duration-200">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button that triggers Ctrl+K palette */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#1B2C4D] bg-slate-50 dark:bg-[#0A1630] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 transition w-full max-w-xs md:max-w-sm"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{t('searchPlaceholder')}</span>
          <kbd className="hidden sm:inline-flex ml-auto text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Year Selector */}
        <div className="hidden md:flex items-center">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="text-xs font-semibold bg-slate-100 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
          >
            <option value="2026 - 2027">Session 2026-27</option>
            <option value="2025 - 2026">Session 2025-26</option>
            <option value="2024 - 2025">Session 2024-25</option>
          </select>
        </div>

        {/* Language Toggle (English / Urdu) */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#0A1630] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#1B2C4D] transition"
          title="Toggle Language (English / اردو)"
        >
          <Globe className="w-3.5 h-3.5 text-[#2F6FDE]" />
          <span>{language === 'en' ? 'اردو' : 'ENG'}</span>
        </button>

        {/* Theme Toggle (Sun / Moon) */}
        <ThemeToggle />

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#0A1630] dark:hover:bg-slate-800 transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0D1B34] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1B2C4D]">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {notices.length} New
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-[#1B2C4D] max-h-64 overflow-y-auto">
                {notices.slice(0, 4).map((n) => (
                  <div key={n.id} className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8FA3C4] line-clamp-2 mt-0.5">{n.content}</p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">{n.date}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setShowNotifications(false); navigate('/notices'); }}
                className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-[#2F6FDE] hover:underline"
              >
                View all school notices
              </button>
            </div>
          )}
        </div>

        {/* Admin Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-[#1B2C4D] hover:bg-slate-50 dark:hover:bg-[#0A1630] transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/30"
            />
            <div className="hidden sm:block text-left text-xs pr-1">
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-400 leading-tight">Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-[#1B2C4D] mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              </div>

              <button
                onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12254A] transition"
              >
                <User className="w-4 h-4 text-blue-500" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12254A] transition"
              >
                <Settings className="w-4 h-4 text-amber-500" />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-[#1B2C4D]" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
