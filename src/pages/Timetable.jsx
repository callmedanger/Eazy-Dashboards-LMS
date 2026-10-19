import React, { useState } from 'react';
import { CalendarDays, Clock, Plus, Printer, Edit, Trash2 } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

export const Timetable = () => {
  const { classes, teachers, timetables, setTimetables } = useSchool();
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const classSchedule = timetables[selectedClass] || [
    { period: 1, time: '08:00 - 08:45', monday: 'Mathematics', tuesday: 'Mathematics', wednesday: 'Mathematics', thursday: 'Physics', friday: 'Islamiat' },
    { period: 2, time: '08:45 - 09:30', monday: 'Physics', tuesday: 'Physics', wednesday: 'Chemistry', thursday: 'Chemistry', friday: 'Urdu' },
    { period: 3, time: '09:30 - 10:15', monday: 'Chemistry', tuesday: 'English', wednesday: 'English', thursday: 'Biology', friday: 'English' },
    { period: 4, time: '10:45 - 11:30', monday: 'English', tuesday: 'Urdu', wednesday: 'Biology', thursday: 'Mathematics', friday: 'Pak Studies' },
    { period: 5, time: '11:30 - 12:15', monday: 'Biology', tuesday: 'Pak Studies', wednesday: 'Physics', thursday: 'Computer Lab', friday: 'Sports/PE' },
    { period: 6, time: '12:15 - 01:00', monday: 'Urdu', tuesday: 'Islamiat', wednesday: 'Chemistry Lab', thursday: 'Robotics', friday: 'Library' }
  ];

  const getSubjectColor = (subject) => {
    switch (subject?.toLowerCase()) {
      case 'mathematics': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'physics': return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'chemistry': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'biology': return 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-900';
      case 'english': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'urdu': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'computer lab':
      case 'robotics': return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Master Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Weekly scheduled periods, lecture timings, and faculty allocations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex items-center gap-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Grade & Section:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-1.5 text-slate-900 dark:text-white font-semibold"
        >
          <option value="Class 10-A">Class 10 - Section A</option>
          <option value="Class 10-B">Class 10 - Section B</option>
          <option value="Class 9-A">Class 9 - Section A</option>
          <option value="Class 8-A">Class 8 - Section A</option>
        </select>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
              <tr>
                <th className="py-3 px-4 text-left w-36">Period / Timing</th>
                <th className="py-3 px-4">Monday</th>
                <th className="py-3 px-4">Tuesday</th>
                <th className="py-3 px-4">Wednesday</th>
                <th className="py-3 px-4">Thursday</th>
                <th className="py-3 px-4">Friday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
              {classSchedule.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#12254A]/20">
                  <td className="py-3.5 px-4 text-left border-r border-slate-100 dark:border-[#1B2C4D]">
                    <p className="font-bold text-slate-900 dark:text-white">Period {p.period}</p>
                    <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {p.time}
                    </p>
                  </td>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                    <td key={day} className="py-3 px-3">
                      <div className={`p-2 rounded-xl border text-xs font-semibold ${getSubjectColor(p[day])}`}>
                        {p[day]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
