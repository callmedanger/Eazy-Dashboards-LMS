import React from 'react';
import { Printer } from 'lucide-react';
import { formatPKR, formatDate } from '../utils/helpers';
import { useSchool } from '../context/SchoolContext';

export const FeeReceipt = ({ record, onClose }) => {
  const { schoolSettings } = useSchool();
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Printable Area */}
      <div id="printable-receipt" className="p-6 bg-white text-slate-900 border border-slate-300 rounded-xl shadow-sm text-sm print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase text-blue-950">{schoolSettings.name}</h2>
            <p className="text-xs text-slate-600 font-medium">{schoolSettings.tagline}</p>
            <p className="text-[11px] text-slate-500">{schoolSettings.address} | Ph: {schoolSettings.phone}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-blue-900 text-white font-bold text-xs rounded uppercase tracking-wider mb-1">
              Official Fee Receipt
            </span>
            <p className="text-xs font-mono font-bold text-slate-700">Receipt #: {record.receiptNo || 'REC-40912'}</p>
            <p className="text-[11px] text-slate-500">Date: {formatDate(record.paymentDate || new Date())}</p>
          </div>
        </div>

        {/* Student & Class Meta */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4 text-xs">
          <div>
            <p className="text-slate-500">Student Name:</p>
            <p className="font-bold text-slate-900 text-sm">{record.studentName}</p>
            <p className="text-slate-500 mt-1">Roll Number: <span className="font-semibold text-slate-800">{record.rollNo}</span></p>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-slate-500">Class & Section:</p>
            <p className="font-bold text-slate-900 text-sm">{record.class} - {record.section}</p>
            <p className="text-slate-500 mt-1">Billing Month: <span className="font-semibold text-slate-800">{record.month}</span></p>
          </div>
        </div>

        {/* Breakdown Table */}
        <table className="w-full text-xs text-left mb-6 border-collapse">
          <thead>
            <tr className="border-b border-slate-300 text-slate-600 bg-slate-100">
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3 text-center">Month</th>
              <th className="py-2 px-3 text-right">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-2.5 px-3 font-medium text-slate-800">Monthly Tuition & Facility Fee</td>
              <td className="py-2.5 px-3 text-center text-slate-600">{record.month}</td>
              <td className="py-2.5 px-3 text-right font-semibold">{formatPKR(record.amount)}</td>
            </tr>
            {record.lateFine > 0 && (
              <tr>
                <td className="py-2 px-3 text-rose-600">Late Payment Surcharge</td>
                <td className="py-2 px-3 text-center text-slate-600">-</td>
                <td className="py-2 px-3 text-right font-semibold text-rose-600">{formatPKR(record.lateFine)}</td>
              </tr>
            )}
            <tr className="bg-slate-50 font-bold border-t border-slate-300">
              <td className="py-2.5 px-3">Total Amount Due</td>
              <td></td>
              <td className="py-2.5 px-3 text-right">{formatPKR(record.amount + (record.lateFine || 0))}</td>
            </tr>
            <tr className="text-emerald-700 font-bold">
              <td className="py-2 px-3">Amount Received ({record.paymentMethod || 'Cash'})</td>
              <td></td>
              <td className="py-2 px-3 text-right">{formatPKR(record.paidAmount)}</td>
            </tr>
            <tr className="text-rose-600 font-bold">
              <td className="py-2 px-3">Net Balance Remaining</td>
              <td></td>
              <td className="py-2 px-3 text-right">{formatPKR(record.balance)}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer Notes & Signatures */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">Payment Status: <span className="uppercase text-emerald-600">{record.status}</span></p>
            <p className="mt-1">Remarks: {record.remarks || 'Electronic receipt computer generated.'}</p>
          </div>
          <div className="text-right flex flex-col justify-end items-end">
            <div className="w-36 border-b border-slate-400 mb-1"></div>
            <p className="font-medium text-slate-700">Accounts Officer Signature</p>
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
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2F6FDE] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>
    </div>
  );
};
