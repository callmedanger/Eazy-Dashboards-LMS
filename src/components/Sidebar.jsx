import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  School,
  GraduationCap,
  CalendarCheck,
  CalendarDays,
  FileSpreadsheet,
  Receipt,
  TrendingDown,
  CircleDollarSign,
  BarChart3,
  UserPlus,
  Bell,
  Calendar,
  FolderOpen,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();

  const navigationSections = [
    {
      group: 'MAIN',
      items: [
        { name: t('dashboard'), path: '/', icon: LayoutDashboard },
      ]
    },
    {
      group: 'ACADEMICS',
      items: [
        { name: t('students'), path: '/students', icon: Users },
        { name: t('classes'), path: '/classes', icon: School },
        { name: t('teachers'), path: '/teachers', icon: GraduationCap },
        { name: t('attendance'), path: '/attendance', icon: CalendarCheck },
        // { name: t('timetable'), path: '/timetable', icon: CalendarDays },
        // { name: t('exams'), path: '/exams', icon: FileSpreadsheet },
      ]
    },
    {
      group: 'FINANCE',
      items: [
        { name: t('fees'), path: '/fees', icon: Receipt },
        { name: t('expenses'), path: '/expenses', icon: TrendingDown },
        { name: t('payroll'), path: '/payroll', icon: CircleDollarSign },
        { name: t('analytics'), path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      group: 'SCHOOL',
      items: [
        { name: t('admissions'), path: '/admissions', icon: UserPlus },
        // { name: t('notices'), path: '/notices', icon: Bell },
        // { name: t('events'), path: '/events', icon: Calendar },
        { name: t('documents'), path: '/documents', icon: FolderOpen },
      ]
    },
    {
      group: 'ACCOUNT',
      items: [
        { name: t('profile'), path: '/profile', icon: UserCircle },
        { name: t('settings'), path: '/settings', icon: Settings },
      ]
    }
  ];

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container positioned left in LTR and right in RTL */}
      <aside
        className={`fixed top-0 bottom-0 z-50 flex flex-col transition-all duration-300 ease-in-out
          ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen 
            ? 'translate-x-0' 
            : (isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
          }
          ${isDark
            ? 'bg-[#0B1E3F] text-white border-[#1B3666]' // Blue Dark Theme
            : 'bg-white text-slate-800 border-slate-200 shadow-sm' // Pure Clean White Theme
          }
        `}
      >
        {/* Brand Header */}
        <div className={`flex items-center justify-between h-16 px-4 border-b transition-colors duration-200 ${
          isDark ? 'border-[#1B3666]' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              isDark
                ? 'bg-gradient-to-tr from-[#3B82F6] to-cyan-400 text-white shadow-blue-500/20'
                : 'bg-[#0B2A5B] text-white shadow-blue-900/20'
            }`}>
              <School className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className={`font-black tracking-tight text-base leading-tight ${isDark ? 'text-white' : 'text-[#0B2A5B]'}`}>
                  EAZY SCHOOL
                </span>
                <span className={`text-[10px] font-semibold tracking-wider ${isDark ? 'text-blue-300' : 'text-[#2F6FDE]'}`}>
                  ADMIN SUITE
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex p-1.5 rounded-lg transition ${
              isDark
                ? 'text-blue-200 hover:text-white hover:bg-blue-900/50'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isRTL ? (
              isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className={`px-3 text-[10px] font-bold tracking-wider uppercase mb-1.5 ${
                  isDark ? 'text-blue-300/70' : 'text-slate-400'
                }`}>
                  {sec.group}
                </p>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={handleLinkClick}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150
                      ${isDark
                        ? (isActive
                            ? 'bg-[#1E4A94] text-white shadow-md shadow-blue-900/30'
                            : 'text-blue-100 hover:text-white hover:bg-blue-900/30'
                          )
                        : (isActive
                            ? 'bg-[#0B2A5B] text-white shadow-md shadow-blue-950/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          )
                      }
                      ${isCollapsed ? 'justify-center px-0' : ''}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className={`absolute top-1.5 bottom-1.5 w-1 ${
                            isRTL 
                              ? 'right-0 rounded-l-md' 
                              : 'left-0 rounded-r-md'
                          } ${
                            isDark ? 'bg-[#38BDF8]' : 'bg-[#2F6FDE]'
                          }`} />
                        )}
                        <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-white'
                            : isDark ? 'text-blue-300 group-hover:scale-110' : 'text-slate-400 group-hover:text-slate-700 group-hover:scale-110'
                        }`} />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        {!isCollapsed && (
          <div className={`p-3 m-3 rounded-2xl border text-xs transition-colors duration-200 ${
            isDark
              ? 'bg-[#061530] border-[#1B3666] text-blue-200'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>License Active</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-blue-300/80' : 'text-slate-400'}`}>Eazy Management v3.4</p>
          </div>
        )}
      </aside>
    </>
  );
};
