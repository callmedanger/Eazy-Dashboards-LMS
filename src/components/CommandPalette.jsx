import React, { useState, useEffect } from 'react';
import { Search, Command, X, Users, GraduationCap, School, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { students, teachers, classes } = useSchool();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredStudents = q ? students.filter(s =>
    s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.class.toLowerCase().includes(q)
  ).slice(0, 5) : [];

  const filteredTeachers = q ? teachers.filter(t =>
    t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const filteredClasses = q ? classes.filter(c =>
    c.name.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const defaultPages = [
    { title: 'Dashboard', path: '/', category: 'Navigation' },
    { title: 'Students Directory', path: '/students', category: 'Academics' },
    { title: 'Fee Management & Collections', path: '/fees', category: 'Finance' },
    { title: 'Daily Attendance Sheet', path: '/attendance', category: 'Academics' },
    { title: 'Class Timetables', path: '/timetable', category: 'Academics' },
    { title: 'Expense Tracking', path: '/expenses', category: 'Finance' },
    { title: 'Salary Payroll', path: '/payroll', category: 'Finance' },
    { title: 'Admission Inquiries Kanban', path: '/admissions', category: 'School' },
    { title: 'Financial Analytics & Revenue', path: '/analytics', category: 'Finance' },
    { title: 'School Settings', path: '/settings', category: 'Settings' },
  ];

  const filteredPages = q ? defaultPages.filter(p => p.title.toLowerCase().includes(q)) : defaultPages.slice(0, 5);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="mx-auto max-w-xl transform rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-2xl transition-all overflow-hidden relative">
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-[#1B2C4D]">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            className="w-full bg-transparent py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            placeholder="Type a command or search students, teachers, classes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8FA3C4] mb-1">
                Pages & Navigation
              </p>
              {filteredPages.map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(page.path)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12254A] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>{page.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{page.category}</span>
                </button>
              ))}
            </div>
          )}

          {/* Students */}
          {filteredStudents.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8FA3C4] mb-1">
                Students Found
              </p>
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(`/students/${s.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12254A] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={s.photo} alt={s.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="text-left">
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.class}-{s.section} | Roll: {s.rollNo}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Teachers */}
          {filteredTeachers.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8FA3C4] mb-1">
                Faculty & Teachers
              </p>
              {filteredTeachers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(`/teachers/${t.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12254A] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <div className="text-left">
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.subject} • {t.phone}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Classes */}
          {filteredClasses.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8FA3C4] mb-1">
                Classes
              </p>
              {filteredClasses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(`/classes`)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12254A] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <School className="w-4 h-4 text-amber-500" />
                    <span>{c.name} (Sections: {c.sections.join(', ')})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Teacher: {c.classTeacher}</span>
                </button>
              ))}
            </div>
          )}

          {q && filteredStudents.length === 0 && filteredTeachers.length === 0 && filteredClasses.length === 0 && filteredPages.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching results found for "{query}"
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 dark:border-[#1B2C4D] bg-slate-50 dark:bg-[#0A1630] px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with keys or click</span>
          <div className="flex gap-2">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border">Ctrl+K</kbd> to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
