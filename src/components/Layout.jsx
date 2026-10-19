import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { isRTL } = useLanguage();
  const location = useLocation();

  // Create human-readable breadcrumbs from pathname
  const pathnames = location.pathname.split('/').filter((x) => x);
  const formatBreadcrumb = (str) => {
    if (str.startsWith('STD-') || str.startsWith('T-')) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#060E1F] text-[#0F172A] dark:text-[#E6ECF7] transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main wrapper shifted by sidebar width (left in LTR, right in RTL) */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isRTL
            ? (isCollapsed ? 'lg:pr-20 lg:pl-0' : 'lg:pr-64 lg:pl-0')
            : (isCollapsed ? 'lg:pl-20 lg:pr-0' : 'lg:pl-64 lg:pr-0')
        }`}
      >
        {/* Navbar */}
        <Navbar
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
        />

        {/* Global Command Palette */}
        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

        {/* Breadcrumbs Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-2">
          <nav className="flex items-center text-xs text-slate-500 dark:text-[#8FA3C4]">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</Link>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              return (
                <React.Fragment key={to}>
                  <ChevronRight className={`w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 ${isRTL ? 'rotate-180' : ''}`} />
                  {isLast ? (
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatBreadcrumb(value)}
                    </span>
                  ) : (
                    <Link to={to} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {formatBreadcrumb(value)}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-10">
          <Outlet />
        </main>

        {/* Footer with branding */}
        <footer className="mt-auto border-t border-slate-200 dark:border-[#1B2C4D] bg-white dark:bg-[#0D1B34] py-4 px-6 text-center text-xs text-slate-500 dark:text-[#8FA3C4]">
          <p className="flex items-center justify-center gap-1.5">
            <span>Powered by</span>
            <span className="font-bold text-[#0B2A5B] dark:text-[#2F6FDE]">Eazy Dashboard</span>
            <span>• Next Generation School Management Architecture</span>
          </p>
        </footer>
      </div>
    </div>
  );
};
