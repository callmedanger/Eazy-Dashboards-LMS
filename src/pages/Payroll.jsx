import React, { useState } from 'react';
import { CircleDollarSign, CheckCircle, Printer, Download, Clock } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { formatPKR, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Payroll = () => {
  const { teachers, schoolSettings } = useSchool();
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [printableSlip, setPrintableSlip] = useState(null);

  // Status mapping
  const [paidStatusMap, setPaidStatusMap] = useState(() => {
    const map = {};
    teachers.forEach((t, idx) => {
      map[t.id] = idx % 4 === 0 ? 'Pending' : 'Paid';
    });
    return map;
  });

  const handleMarkAsPaid = (teacherId) => {
    setPaidStatusMap(prev => ({
      ...prev,
      [teacherId]: 'Paid'
    }));
    toast.success('Salary marked as disbursed');
  };

  const totalPayroll = teachers.reduce((sum, t) => sum + (t.salary || 0), 0);
  const totalDisbursed = teachers.filter(t => (paidStatusMap[t.id] || 'Paid') === 'Paid').reduce((sum, t) => sum + t.salary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Staff & Faculty Salary Payroll
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Monthly payroll disbursement, salary slips, and allowance calculations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-800 dark:text-slate-200 font-bold"
          >
            <option value="October 2026">October 2026 Payroll</option>
            <option value="September 2026">September 2026 Payroll</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Monthly Obligation</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{formatPKR(totalPayroll)}</p>
          <span className="text-[11px] text-slate-400">{teachers.length} Active Staff Members</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <span className="text-[10px] text-emerald-600 font-semibold uppercase">Disbursed So Far</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatPKR(totalDisbursed)}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Bank Transferred</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D]">
          <span className="text-[10px] text-rose-600 font-semibold uppercase">Pending Disbursement</span>
          <p className="text-xl font-bold text-rose-600 mt-1">{formatPKR(totalPayroll - totalDisbursed)}</p>
          <span className="text-[11px] text-rose-600 font-medium">Scheduled for this Friday</span>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Base Salary</th>
                <th className="py-3 px-4">Allowance</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4 font-bold text-slate-900 dark:text-white">Net Pay</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
              {teachers.map((t) => {
                const status = paidStatusMap[t.id] || 'Paid';
                const allowance = Math.round(t.salary * 0.1);
                const deduction = 1500; // Tax/provident fund
                const netPay = t.salary + allowance - deduction;

                return (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={t.photo} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{t.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{t.subject}</td>
                    <td className="py-3 px-4">{formatPKR(t.salary)}</td>
                    <td className="py-3 px-4 text-emerald-600">+{formatPKR(allowance)}</td>
                    <td className="py-3 px-4 text-rose-500">-{formatPKR(deduction)}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{formatPKR(netPay)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={status === 'Paid' ? 'paid' : 'unpaid'}>{status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {status !== 'Paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(t.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => setPrintableSlip({ teacher: t, allowance, deduction, netPay, month: selectedMonth })}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Print Pay Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Printable Modal */}
      <Modal
        isOpen={!!printableSlip}
        onClose={() => setPrintableSlip(null)}
        title="Employee Monthly Pay Slip"
        subtitle="Confidential remuneration advice"
      >
        {printableSlip && (
          <div className="space-y-4">
            <div className="p-6 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs print:p-0 print:border-none">
              <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-black uppercase text-blue-950">{schoolSettings.name}</h3>
                  <p className="text-[11px] text-slate-500">Employee Salary Slip • {printableSlip.month}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded uppercase">
                    CONFIDENTIAL
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded mb-4">
                <p><strong>Employee:</strong> {printableSlip.teacher.name}</p>
                <p><strong>Department:</strong> {printableSlip.teacher.subject}</p>
                <p><strong>Staff ID:</strong> {printableSlip.teacher.id}</p>
                <p><strong>Pay Date:</strong> 01 {printableSlip.month}</p>
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
                    <td className="p-2 text-right">{formatPKR(printableSlip.teacher.salary)}</td>
                    <td className="p-2">Income Tax / Fund</td>
                    <td className="p-2 text-right text-rose-600">{formatPKR(printableSlip.deduction)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">Medical & Transport Allowance</td>
                    <td className="p-2 text-right">{formatPKR(printableSlip.allowance)}</td>
                    <td className="p-2">Other Deductions</td>
                    <td className="p-2 text-right text-rose-600">Rs. 0</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t">
                    <td className="p-2">Gross Earnings</td>
                    <td className="p-2 text-right text-emerald-700">{formatPKR(printableSlip.teacher.salary + printableSlip.allowance)}</td>
                    <td className="p-2">Net Disbursed</td>
                    <td className="p-2 text-right text-blue-900">{formatPKR(printableSlip.netPay)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 border-t flex justify-between text-[11px] text-slate-500">
                <p>System Generated Electronic Slip</p>
                <div className="text-right">
                  <div className="w-28 border-b border-slate-400 mb-1 ml-auto"></div>
                  <p>Finance Officer</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setPrintableSlip(null)} className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-xl">
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2F6FDE] hover:bg-blue-600 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Salary Slip
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
