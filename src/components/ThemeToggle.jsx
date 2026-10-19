import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
        theme === 'dark'
          ? 'bg-[#0B2247] border-[#1E3D6B] text-white hover:bg-[#122F5E] shadow-sm'
          : 'bg-slate-100 border-slate-200 text-[#0B2A5B] hover:bg-slate-200 shadow-xs'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light (White) Theme' : 'Switch to Dark (Blue & White) Theme'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
          <span className="hidden sm:inline text-white">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[#0B2A5B] transition-transform duration-300 rotate-0 hover:-rotate-12" />
          <span className="hidden sm:inline text-slate-700">Dark</span>
        </>
      )}
    </button>
  );
};
