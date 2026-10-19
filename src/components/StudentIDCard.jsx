import React from 'react';
import { Printer, QrCode } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const StudentIDCard = ({ student, onClose }) => {
  const { schoolSettings } = useSchool();
  if (!student) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
        {/* Front of ID Card */}
        <div className="w-72 h-[410px] rounded-2xl bg-white border border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between text-slate-800 text-center relative print:shadow-none">
          {/* Top Navy Curve */}
          <div className="bg-[#0B2A5B] text-white p-4 pb-6 rounded-b-[30px] relative">
            <h3 className="font-extrabold text-sm tracking-wide uppercase">{schoolSettings.name}</h3>
            <p className="text-[10px] text-blue-200 mt-0.5">STUDENT IDENTITY CARD</p>
          </div>

          {/* Photo */}
          <div className="-mt-10 flex justify-center">
            <img
              src={student.photo}
              alt={student.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-slate-100"
            />
          </div>

          {/* Name & Details */}
          <div className="px-4 py-2 space-y-1">
            <h4 className="font-extrabold text-base text-slate-900 leading-tight">{student.name}</h4>
            <p className="text-xs font-semibold text-blue-700">{student.class} - Section {student.section}</p>
            <p className="text-[11px] text-slate-500 font-mono">Roll No: {student.rollNo}</p>
          </div>

          <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Father:</span>
              <span className="font-semibold text-slate-700">{student.fatherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency:</span>
              <span className="font-semibold text-slate-700">{student.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valid Till:</span>
              <span className="font-semibold text-slate-700">March 2027</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bg-[#0B2A5B] text-[10px] text-blue-200 py-1.5 font-medium">
            Authorized Signature
          </div>
        </div>

        {/* Back of ID Card */}
        <div className="w-72 h-[410px] rounded-2xl bg-white border border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between text-slate-800 p-5 text-center print:shadow-none">
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-blue-900 flex items-center justify-center text-white text-xs font-bold">E</div>
              <span className="font-extrabold text-xs uppercase text-slate-900">{schoolSettings.name}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              This card is the property of the school. If found, please return to the school administration office.
            </p>
          </div>

          {/* QR code and Barcode simulation */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <QrCode className="w-20 h-20 text-slate-800" />
            </div>
            <p className="text-[9px] font-mono text-slate-400 mt-1">ID: {student.id}</p>
          </div>

          <div className="text-[10px] text-slate-600 space-y-1 text-left border-t border-slate-200 pt-2">
            <p><strong>Address:</strong> {schoolSettings.address}</p>
            <p><strong>Helpline:</strong> {schoolSettings.phone}</p>
            <p><strong>Email:</strong> {schoolSettings.email}</p>
          </div>

          <div className="pt-2 border-t border-dashed border-slate-300">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Principal Verification Seal</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 no-print pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Close
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2F6FDE] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print ID Card (Front & Back)</span>
        </button>
      </div>
    </div>
  );
};
