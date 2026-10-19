import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Award, Printer, Download, CheckCircle } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import toast from 'react-hot-toast';

export const Exams = () => {
  const { exams, students, schoolSettings } = useSchool();
  const [selectedExam, setSelectedExam] = useState(exams[0]?.id || 'EXAM-1');
  const [printableStudentReport, setPrintableStudentReport] = useState(null);

  const examObj = exams.find(e => e.id === selectedExam) || exams[0];
  const examStudents = students.filter(s => s.class === examObj?.class).slice(0, 10);

  // Generate sample marks per student
  const marksData = examStudents.map((st, idx) => {
    const math = 85 - (idx * 4);
    const phy = 88 - (idx * 3);
    const chem = 82 - (idx * 5);
    const eng = 78 + (idx * 2);
    const urdu = 80 - (idx * 2);
    const total = math + phy + chem + eng + urdu;
    const pct = Math.round((total / 500) * 100);
    const grade = pct >= 80 ? 'A+' : (pct >= 70 ? 'A' : (pct >= 60 ? 'B' : 'C'));

    return {
      student: st,
      math,
      phy,
      chem,
      eng,
      urdu,
      total,
      pct,
      grade,
      position: idx + 1
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Exams, Assessments & Report Cards
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Marks entry ledger, grading algorithms, and printable student transcripts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-800 dark:text-slate-200 font-bold"
          >
            {exams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.class})</option>)}
          </select>
        </div>
      </div>

      {/* Class Result Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Exam Title</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{examObj.name}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Max Marks</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">500 Marks</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <span className="text-[10px] text-emerald-600 font-semibold uppercase">Passing Ratio</span>
          <p className="text-sm font-bold text-emerald-600 mt-1">98.2% Cleared</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <span className="text-[10px] text-amber-500 font-semibold uppercase">Class Topper</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{marksData[0]?.student.name} (91%)</p>
        </div>
      </div>

      {/* Marks Ledger Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-[#1B2C4D] flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Award List / Score Table</h3>
          <span className="text-xs text-slate-400">Class: {examObj.class}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
              <tr>
                <th className="py-3 px-4">Pos</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Math</th>
                <th className="py-3 px-4">Physics</th>
                <th className="py-3 px-4">Chemistry</th>
                <th className="py-3 px-4">English</th>
                <th className="py-3 px-4">Urdu</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">% Pct</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4 text-right">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
              {marksData.map((m) => (
                <tr key={m.student.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30 transition">
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">#{m.position}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{m.student.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Roll: {m.student.rollNo}</p>
                  </td>
                  <td className="py-3 px-4">{m.math}</td>
                  <td className="py-3 px-4">{m.phy}</td>
                  <td className="py-3 px-4">{m.chem}</td>
                  <td className="py-3 px-4">{m.eng}</td>
                  <td className="py-3 px-4">{m.urdu}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{m.total}/500</td>
                  <td className="py-3 px-4 font-semibold text-blue-600">{m.pct}%</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded">
                      {m.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setPrintableStudentReport(m)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Print Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Card Modal */}
      <Modal
        isOpen={!!printableStudentReport}
        onClose={() => setPrintableStudentReport(null)}
        title="Student Term Report Card"
        subtitle="Official school performance transcript ready for printing"
      >
        {printableStudentReport && (
          <div className="space-y-4">
            <div className="p-6 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs print:p-0 print:border-none print:shadow-none">
              <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                <h2 className="text-lg font-black uppercase text-blue-950">{schoolSettings.name}</h2>
                <p className="text-[11px] text-slate-600">{schoolSettings.address}</p>
                <p className="inline-block mt-1 px-3 py-0.5 bg-blue-900 text-white font-bold rounded text-[10px] uppercase">
                  Academic Progress Report Card
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border mb-4">
                <div>
                  <p><strong>Student Name:</strong> {printableStudentReport.student.name}</p>
                  <p><strong>Father Name:</strong> {printableStudentReport.student.fatherName}</p>
                  <p><strong>Roll No:</strong> {printableStudentReport.student.rollNo}</p>
                </div>
                <div>
                  <p><strong>Class & Sec:</strong> {printableStudentReport.student.class} - {printableStudentReport.student.section}</p>
                  <p><strong>Exam Session:</strong> {examObj.name}</p>
                  <p><strong>Position in Class:</strong> #{printableStudentReport.position}</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-slate-300 mb-4">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300">Subject</th>
                    <th className="p-2 border-r border-slate-300 text-center">Max Marks</th>
                    <th className="p-2 border-r border-slate-300 text-center">Obtained Marks</th>
                    <th className="p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr><td className="p-2 border-r">Mathematics</td><td className="p-2 border-r text-center">100</td><td className="p-2 border-r text-center font-bold">{printableStudentReport.math}</td><td className="p-2 text-center">A</td></tr>
                  <tr><td className="p-2 border-r">Physics</td><td className="p-2 border-r text-center">100</td><td className="p-2 border-r text-center font-bold">{printableStudentReport.phy}</td><td className="p-2 text-center">A+</td></tr>
                  <tr><td className="p-2 border-r">Chemistry</td><td className="p-2 border-r text-center">100</td><td className="p-2 border-r text-center font-bold">{printableStudentReport.chem}</td><td className="p-2 text-center">A</td></tr>
                  <tr><td className="p-2 border-r">English Literature</td><td className="p-2 border-r text-center">100</td><td className="p-2 border-r text-center font-bold">{printableStudentReport.eng}</td><td className="p-2 text-center">B</td></tr>
                  <tr><td className="p-2 border-r">Urdu</td><td className="p-2 border-r text-center">100</td><td className="p-2 border-r text-center font-bold">{printableStudentReport.urdu}</td><td className="p-2 text-center">A</td></tr>
                  <tr className="bg-slate-50 font-bold border-t border-slate-300">
                    <td className="p-2 border-r">Grand Total</td>
                    <td className="p-2 border-r text-center">500</td>
                    <td className="p-2 border-r text-center text-blue-900">{printableStudentReport.total}</td>
                    <td className="p-2 text-center text-emerald-700">{printableStudentReport.grade} ({printableStudentReport.pct}%)</td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 mt-6 text-center">
                <div>
                  <div className="w-36 border-b border-slate-400 mx-auto mb-1"></div>
                  <p className="text-[10px] text-slate-500 font-semibold">Class Teacher Signature</p>
                </div>
                <div>
                  <div className="w-36 border-b border-slate-400 mx-auto mb-1"></div>
                  <p className="text-[10px] text-slate-500 font-semibold">Principal Verification Stamp</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintableStudentReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2F6FDE] hover:bg-blue-600 flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Report Card
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
