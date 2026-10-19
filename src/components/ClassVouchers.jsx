import React from 'react';
import { Printer } from 'lucide-react';
import { formatPKR } from '../utils/helpers';
import { useSchool } from '../context/SchoolContext';

export const ClassVouchers = ({ className, sectionName, onClose }) => {
  const { students, schoolSettings } = useSchool();

  const classStudents = students.filter(s => s.class === className && s.section === sectionName);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1B2C4D]">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Bulk Fee Vouchers: {className} (Section {sectionName})
          </h4>
          <p className="text-xs text-slate-500">Generating vouchers for {classStudents.length} enrolled students</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#2F6FDE] hover:bg-blue-600 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print All Vouchers</span>
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto space-y-6 p-2">
        {classStudents.map((st) => (
          <div
            key={st.id}
            className="p-4 bg-white text-slate-900 border-2 border-dashed border-slate-300 rounded-xl break-inside-avoid print:mb-8 text-xs"
          >
            <div className="flex justify-between items-start border-b border-slate-300 pb-2 mb-2">
              <div>
                <p className="font-black text-sm uppercase text-blue-950">{schoolSettings.name}</p>
                <p className="text-[10px] text-slate-500">Monthly Fee Challan - Session 2026-27</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded">BANK COPY / STUDENT COPY</span>
                <p className="text-[10px] text-slate-500 mt-1">Due Date: {schoolSettings.feeDueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 p-2 rounded">
              <p><strong>Student:</strong> {st.name}</p>
              <p><strong>Father:</strong> {st.fatherName}</p>
              <p><strong>Class & Sec:</strong> {st.class}-{st.section}</p>
              <p><strong>Roll No:</strong> {st.rollNo}</p>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold border-t border-b border-slate-200 py-1.5 mb-3">
              <span>Tuition Fee (October 2026)</span>
              <span>{formatPKR(st.monthlyFee)}</span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500">
              <span>Late fee surcharge of Rs. 500 applies after due date.</span>
              <span className="font-mono">Challan Ref: #{st.id}-OCT</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
