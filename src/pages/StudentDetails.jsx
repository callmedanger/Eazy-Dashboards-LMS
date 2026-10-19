import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  IdCard,
  CreditCard,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { StudentIDCard } from '../components/StudentIDCard';
import { FeeReceipt } from '../components/FeeReceipt';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatPKR, formatDate } from '../utils/helpers';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, feeRecords, deleteStudent, collectFee } = useSchool();

  const [activeTab, setActiveTab] = useState('overview');
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Quick Collect Fee from Student Details
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [feeAmount, setFeeAmount] = useState('');
  const [feeMonth, setFeeMonth] = useState('October 2026');
  const [feeMethod, setFeeMethod] = useState('Cash');
  const [feeRemarks, setFeeRemarks] = useState('');

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#0D1B34] rounded-2xl border">
        <h3 className="font-bold text-lg">Student Not Found</h3>
        <button onClick={() => navigate('/students')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs">
          Back to Students Directory
        </button>
      </div>
    );
  }

  // Student specific fee history
  const studentFeeHistory = feeRecords.filter(r => r.studentId === student.id);
  const totalPaid = studentFeeHistory.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const totalBalance = studentFeeHistory.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const handleFeeSubmit = (e) => {
    e.preventDefault();
    if (!feeAmount) return;

    const receipt = collectFee({
      studentId: student.id,
      amount: Number(feeAmount),
      paymentMethod: feeMethod,
      month: feeMonth,
      remarks: feeRemarks || `Fee for ${student.name}`
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    toast.success(`Fee recorded for ${student.name}! Ledger & status updated.`);
    setIsFeeModalOpen(false);
    setSelectedReceipt(receipt);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/students')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Students Directory</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={student.photo}
              alt={student.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-[#12254A] shadow-md"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {student.name}
                </h1>
                <Badge variant={student.feeStatus.toLowerCase()}>
                  {student.feeStatus}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-[#2F6FDE]">
                {student.class} • Section {student.section} • Roll No: {student.rollNo}
              </p>
              <p className="text-xs text-slate-500 dark:text-[#8FA3C4]">
                Father: <strong>{student.fatherName}</strong> • Enrolled: {formatDate(student.admissionDate)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setFeeAmount(student.balanceDue || student.monthlyFee);
                setIsFeeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Collect Fee</span>
            </button>
            <button
              onClick={() => setIsIDCardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 transition"
            >
              <IdCard className="w-4 h-4" />
              <span>Generate ID Card</span>
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition"
              title="Delete Student"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini KPI Cards for Student */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-[#1B2C4D]">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</span>
            <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatPKR(totalPaid)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Balance Due</span>
            <p className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">{formatPKR(student.balanceDue)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Tuition</span>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">{formatPKR(student.monthlyFee)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Attendance Rate</span>
            <p className="text-sm sm:text-base font-bold text-[#2F6FDE] mt-0.5">{student.attendancePct}%</p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-[#1B2C4D] gap-6 text-xs font-semibold">
        {['overview', 'fee history', 'attendance', 'remarks'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition relative ${activeTab === tab ? 'text-[#2F6FDE]' : 'text-slate-400 hover:text-slate-700'}`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F6FDE] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Personal & Family Information</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">Full Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">Father Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.fatherName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">Gender</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.gender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">Date of Birth</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{student.dob}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Current Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{student.address}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Academic & Contact</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">Class & Section</span>
                <span className="font-semibold text-blue-600">{student.class} - {student.section}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">Roll Number</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{student.rollNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">Primary Contact Phone</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{student.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1B2C4D]">
                <span className="text-slate-400">WhatsApp Emergency</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{student.whatsapp}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Admission Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(student.admissionDate)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fee history' && (
        <div className="rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] overflow-hidden space-y-3">
          <div className="p-4 border-b border-slate-100 dark:border-[#1B2C4D] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Monthly Fee Payment Invoices</h3>
              <p className="text-xs text-slate-400">All registered payment receipts and clearance logs</p>
            </div>
            <button
              onClick={() => {
                setFeeAmount(student.balanceDue || student.monthlyFee);
                setIsFeeModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Fee Payment</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] uppercase font-bold text-slate-500 border-b">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
                {studentFeeHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30">
                    <td className="py-3 px-4 font-mono font-medium">{rec.receiptNo}</td>
                    <td className="py-3 px-4 font-semibold">{rec.month}</td>
                    <td className="py-3 px-4">{formatPKR(rec.amount)}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">{formatPKR(rec.paidAmount)}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">{formatPKR(rec.balance)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={rec.status.toLowerCase()}>{rec.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-[11px]">{rec.paymentMethod || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(rec)}
                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Attendance Calendar Heatmap (October 2026)</h3>
          <p className="text-xs text-slate-400">Total sessions attended: 21 out of 22 school days ({student.attendancePct}%)</p>
          <div className="grid grid-cols-7 sm:grid-cols-11 gap-2 pt-2">
            {Array.from({ length: 22 }, (_, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-center text-xs font-semibold ${
                  i === 14 ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}
              >
                <span>Oct {i + 1}</span>
                <p className="text-[10px] mt-0.5">{i === 14 ? 'Absent' : 'Present'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'remarks' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Teacher & Administrative Observations</h3>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630] border text-xs">
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span>Muhammad Tariq (Class Teacher)</span>
              <span className="text-slate-400">12 Oct 2026</span>
            </div>
            <p className="text-slate-500 mt-1">
              {student.name} demonstrates exceptional discipline and aptitude in mathematics and science lab practicals. Continues to maintain good punctuality.
            </p>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      <Modal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        title={`Record Payment for ${student.name}`}
        subtitle="Collect monthly tuition fee and generate receipt"
      >
        <form onSubmit={handleFeeSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Billing Month</label>
              <select
                value={feeMonth}
                onChange={(e) => setFeeMonth(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              >
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="November 2026">November 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Amount Paid (PKR) *</label>
              <input
                type="number"
                required
                min="1"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5 font-bold text-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Payment Method</label>
            <select
              value={feeMethod}
              onChange={(e) => setFeeMethod(e.target.value)}
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            >
              <option value="Cash">Cash at Counter</option>
              <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
              <option value="Easypaisa">Easypaisa</option>
              <option value="JazzCash">JazzCash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Remarks</label>
            <input
              type="text"
              value={feeRemarks}
              onChange={(e) => setFeeRemarks(e.target.value)}
              placeholder="e.g. Cleared by father via cash"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsFeeModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
            >
              Confirm Payment & Print Slip
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable ID Card Modal */}
      <Modal isOpen={isIDCardOpen} onClose={() => setIsIDCardOpen(false)} title="Student Identity Card">
        <StudentIDCard student={student} onClose={() => setIsIDCardOpen(false)} />
      </Modal>

      {/* Printable Receipt Modal */}
      <Modal isOpen={!!selectedReceipt} onClose={() => setSelectedReceipt(null)} title="Fee Receipt">
        <FeeReceipt record={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteStudent(student.id);
          toast.success('Student profile deleted');
          navigate('/students');
        }}
        title="Delete Student Profile"
        message={`Are you sure you want to delete ${student.name}? This will remove all their records.`}
      />
    </div>
  );
};
