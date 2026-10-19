import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, BookOpen, DollarSign, Award, Clock, CheckCircle, Printer } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { formatPKR, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teachers, schoolSettings } = useSchool();

  // Salary payment status state
  const [isSalaryPaid, setIsSalaryPaid] = useState(true);
  const [isSalarySlipOpen, setIsSalarySlipOpen] = useState(false);

  const teacher = teachers.find(t => t.id === id);

  if (!teacher) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#0D1B34] rounded-2xl border">
        <h3 className="font-bold text-lg">Teacher Record Not Found</h3>
        <button onClick={() => navigate('/teachers')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs">
          Back to Faculty Directory
        </button>
      </div>
    );
  }

  const allowance = Math.round(teacher.salary * 0.1);
  const deduction = 1500;
  const netPay = teacher.salary + allowance - deduction;

  const handleToggleSalary = () => {
    setIsSalaryPaid(prev => {
      const next = !prev;
      toast.success(next ? `Salary marked as disbursed for ${teacher.name}` : `Salary marked as pending`);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/teachers')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Faculty Directory</span>
      </button>

      {/* Main Teacher Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={teacher.photo}
              alt={teacher.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{teacher.name}</h1>
                <Badge variant="success">{teacher.status}</Badge>
              </div>
              <p className="text-sm font-bold text-[#2F6FDE]">{teacher.subject} Department</p>
              <p className="text-xs text-slate-500 dark:text-[#8FA3C4]">{teacher.qualification}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {teacher.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {teacher.email}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined: {formatDate(teacher.joiningDate)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSalary}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isSalaryPaid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {isSalaryPaid ? 'Salary: Paid (Disbursed)' : 'Mark Salary as Paid'}
            </button>
            <button
              onClick={() => setIsSalarySlipOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-blue-600 dark:text-blue-400 hover:bg-slate-50"
            >
              Print Pay Slip
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-[#1B2C4D]">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Base Monthly Salary</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatPKR(teacher.salary)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Classes</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{teacher.assignedClasses?.length || 2} Sections</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Salary Status (October)</span>
            <p className={`text-sm font-bold mt-0.5 ${isSalaryPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isSalaryPaid ? 'Disbursed' : 'Pending'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Performance Rating</span>
            <p className="text-sm font-bold text-amber-500 mt-0.5">4.9 / 5.0</p>
          </div>
        </div>
      </div>

      {/* Assigned Classes & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Assigned Academic Classes</h3>
          <div className="space-y-2">
            {(teacher.assignedClasses || ['Class 9-A', 'Class 10-A']).map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630] text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{cls}</span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{teacher.subject} Lecture (6 periods/week)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Salary & Remuneration Advice</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#1B2C4D]">
              <span className="text-slate-400">Base Salary</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatPKR(teacher.salary)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#1B2C4D]">
              <span className="text-slate-400">Medical & Transport Allowance (+10%)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatPKR(allowance)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#1B2C4D]">
              <span className="text-slate-400">Income Tax & Fund Deduction</span>
              <span className="font-semibold text-rose-500">-{formatPKR(deduction)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-[#1B2C4D]">
              <span className="text-slate-400">Net Monthly Disbursed</span>
              <span className="font-bold text-emerald-600">{formatPKR(netPay)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Payment Status</span>
              <Badge variant={isSalaryPaid ? 'paid' : 'unpaid'} size="sm">
                {isSalaryPaid ? 'Paid' : 'Unpaid'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Slip Modal */}
      <Modal isOpen={isSalarySlipOpen} onClose={() => setIsSalarySlipOpen(false)} title="Teacher Pay Slip">
        <div className="space-y-4">
          <div className="p-6 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs print:p-0 print:border-none">
            <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-black uppercase text-blue-950">{schoolSettings.name}</h3>
                <p className="text-[11px] text-slate-500">Official Faculty Salary Advice Slip</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded uppercase">
                {isSalaryPaid ? 'PAID' : 'PENDING'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded mb-4">
              <p><strong>Employee:</strong> {teacher.name}</p>
              <p><strong>Department:</strong> {teacher.subject}</p>
              <p><strong>Staff ID:</strong> {teacher.id}</p>
              <p><strong>Month:</strong> October 2026</p>
            </div>

            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="p-2 text-left">Earnings</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2 text-left">Deductions</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-2">Basic Pay</td>
                  <td className="p-2 text-right">{formatPKR(teacher.salary)}</td>
                  <td className="p-2">Income Tax / Fund</td>
                  <td className="p-2 text-right text-rose-600">{formatPKR(deduction)}</td>
                </tr>
                <tr>
                  <td className="p-2">Medical & Transport Allowance</td>
                  <td className="p-2 text-right">{formatPKR(allowance)}</td>
                  <td className="p-2">Other Deductions</td>
                  <td className="p-2 text-right text-rose-600">Rs. 0</td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t">
                  <td className="p-2">Gross Earnings</td>
                  <td className="p-2 text-right text-emerald-700">{formatPKR(teacher.salary + allowance)}</td>
                  <td className="p-2">Net Payout</td>
                  <td className="p-2 text-right text-blue-900">{formatPKR(netPay)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsSalarySlipOpen(false)} className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-xl">
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-white bg-[#2F6FDE] hover:bg-blue-600 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Pay Slip
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
