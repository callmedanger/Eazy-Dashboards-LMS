import React, { useState } from 'react';
import { CalendarCheck, Users, Check, X, Clock, AlertCircle, Save, Download, Printer } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Badge } from '../components/Badge';
import toast from 'react-hot-toast';

export const Attendance = () => {
  const { classes, students, addAuditLog } = useSchool();

  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter students
  const classStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection);

  // Status map: { studentId: 'Present' | 'Absent' | 'Leave' | 'Late' }
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const map = {};
    classStudents.forEach(s => {
      map[s.id] = 'Present';
    });
    return map;
  });

  const handleStatusChange = (id, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = 'Present';
    });
    setAttendanceMap(updated);
    toast.success('All students marked as Present');
  };

  const handleSaveAttendance = () => {
    addAuditLog('Attendance Saved', `Recorded attendance for ${selectedClass}-${selectedSection} on ${selectedDate}`);
    toast.success(`Attendance saved successfully for ${classStudents.length} students`);
  };

  const presentCount = classStudents.filter(s => (attendanceMap[s.id] || 'Present') === 'Present').length;
  const absentCount = classStudents.filter(s => attendanceMap[s.id] === 'Absent').length;
  const leaveCount = classStudents.filter(s => attendanceMap[s.id] === 'Leave').length;
  const lateCount = classStudents.filter(s => attendanceMap[s.id] === 'Late').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Daily Student Attendance
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Mark morning assembly attendance and view monthly attendance trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Class and Date Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Grade</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
          >
            {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
          />
        </div>

        {/* Live Counters */}
        <div className="ml-auto flex items-center gap-3 text-xs font-semibold">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Present: {presentCount}
          </span>
          <span className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            Absent: {absentCount}
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Leave / Late: {leaveCount + lateCount}
          </span>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4 text-center">Status Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
              {classStudents.map((st) => {
                const currentStatus = attendanceMap[st.id] || 'Present';
                return (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30 transition">
                    <td className="py-3 px-4 font-mono font-semibold">{st.rollNo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={st.photo} alt={st.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                          <p className="text-[10px] text-slate-400">{st.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{st.fatherName}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{st.attendancePct}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {['Present', 'Absent', 'Leave', 'Late'].map(s => {
                          const isSelected = currentStatus === s;
                          let btnStyle = 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
                          if (isSelected) {
                            if (s === 'Present') btnStyle = 'bg-emerald-600 text-white font-bold shadow-xs';
                            if (s === 'Absent') btnStyle = 'bg-rose-600 text-white font-bold shadow-xs';
                            if (s === 'Leave') btnStyle = 'bg-amber-500 text-white font-bold shadow-xs';
                            if (s === 'Late') btnStyle = 'bg-blue-600 text-white font-bold shadow-xs';
                          }

                          return (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(st.id, s)}
                              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${btnStyle}`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
