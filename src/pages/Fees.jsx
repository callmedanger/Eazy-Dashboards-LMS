import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  CreditCard,
  Printer,
  Download,
  AlertTriangle,
  Send,
  MessageSquare,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { FeeReceipt } from '../components/FeeReceipt';
import { ClassVouchers } from '../components/ClassVouchers';
import { formatPKR, formatDate, downloadCSV } from '../utils/helpers';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export const Fees = () => {
  const { feeRecords, students, classes, collectFee, schoolSettings, setSchoolSettings } = useSchool();

  // Active Tab: 'records', 'defaulters', 'structure'
  const [activeTab, setActiveTab] = useState('records');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [monthFilter, setMonthFilter] = useState('October 2026');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherClass, setVoucherClass] = useState('Class 9');
  const [voucherSection, setVoucherSection] = useState('A');
  const [whatsappPreview, setWhatsappPreview] = useState(null);

  // Collect Fee Form
  const [collectData, setCollectData] = useState({
    studentId: '',
    month: 'October 2026',
    amount: '',
    paymentMethod: 'Cash',
    discount: 0,
    lateFine: 0,
    remarks: ''
  });

  // Calculate totals
  const currentMonthRecords = feeRecords.filter(r => r.month === monthFilter);
  const totalExpected = currentMonthRecords.reduce((acc, curr) => acc + (curr.amount || 0) + (curr.lateFine || 0), 0);
  const totalCollected = currentMonthRecords.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const totalPending = currentMonthRecords.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const overdueCount = currentMonthRecords.filter(r => r.status === 'Overdue').length;
  const collectionPercentage = totalExpected ? Math.round((totalCollected / totalExpected) * 100) : 0;

  // Filtered records
  const filteredRecords = currentMonthRecords.filter(r => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'ALL' || r.class === classFilter;
    const matchesSection = sectionFilter === 'ALL' || r.section === sectionFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesClass && matchesSection && matchesStatus;
  });

  const defaultersList = currentMonthRecords.filter(r => r.status === 'Overdue' || r.status === 'Unpaid');

  // Pagination slice
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCollectSubmit = (e) => {
    e.preventDefault();
    if (!collectData.studentId || !collectData.amount) {
      toast.error('Please choose a student and enter the amount');
      return;
    }

    const updated = collectFee(collectData);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success('Payment recorded successfully!');
    setIsCollectFeeOpen(false);
    setSelectedReceipt(updated); // Open printable receipt immediately
  };

  const handleSendReminder = (record) => {
    const student = students.find(s => s.id === record.studentId);
    const msg = `Dear Parent, This is a reminder from ${schoolSettings.name}. The fee of Rs. ${record.balance.toLocaleString()} for ${record.studentName} (${record.class}-${record.section}) for ${record.month} is pending. Please clear before the due date.`;
    setWhatsappPreview({
      phone: student?.whatsapp || student?.phone || '0300-1234567',
      name: record.studentName,
      message: msg
    });
  };

  const handleExportCSV = () => {
    const headers = ['receiptNo', 'studentName', 'rollNo', 'class', 'section', 'month', 'amount', 'paidAmount', 'balance', 'status', 'paymentMethod'];
    downloadCSV(`Fee_Ledger_${monthFilter.replace(' ', '_')}.csv`, filteredRecords, headers);
    toast.success('Exported fee records to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Fee Management & Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Real-time fee collection ledger, challan generation, and defaulter tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsVoucherModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Class Challans</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setCollectData({
                studentId: '',
                month: 'October 2026',
                amount: '',
                paymentMethod: 'Cash',
                discount: 0,
                lateFine: 0,
                remarks: ''
              });
              setIsCollectFeeOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
          >
            <CreditCard className="w-4 h-4" />
            <span>Collect Fee</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Expected Fee</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{formatPKR(totalExpected)}</p>
          <span className="text-[11px] text-slate-400">Across {currentMonthRecords.length} Students</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Collected</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatPKR(totalCollected)}</p>
          <span className="text-[11px] text-emerald-600/80 font-medium">Clear Cash & Online</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Pending Dues</span>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{formatPKR(totalPending)}</p>
          <span className="text-[11px] text-rose-600/80 font-medium">{defaultersList.length} Students Pending</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Critical Overdue</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{overdueCount} Accounts</p>
          <span className="text-[11px] text-amber-600/80 font-medium">Fine of Rs. 500 added</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Collection %</span>
              <span className="font-extrabold text-[#2F6FDE]">{collectionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#2F6FDE] h-2 rounded-full transition-all duration-500"
                style={{ width: `${collectionPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Target: 95% by 10th of month</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-[#1B2C4D] gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 capitalize transition relative ${activeTab === 'records' ? 'text-[#2F6FDE]' : 'text-slate-400 hover:text-slate-700'}`}
        >
          Fee Invoices & Ledger ({filteredRecords.length})
          {activeTab === 'records' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F6FDE] rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab('defaulters')}
          className={`pb-3 capitalize transition relative ${activeTab === 'defaulters' ? 'text-rose-600' : 'text-slate-400 hover:text-slate-700'}`}
        >
          Defaulters List ({defaultersList.length})
          {activeTab === 'defaulters' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`pb-3 capitalize transition relative ${activeTab === 'structure' ? 'text-[#2F6FDE]' : 'text-slate-400 hover:text-slate-700'}`}
        >
          Fee Structure & Concessions
          {activeTab === 'structure' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F6FDE] rounded-full" />}
        </button>
      </div>

      {/* Tab: Invoices & Ledger */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by student name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
            </select>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="ALL">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="ALL">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] px-3 py-2 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4">Challan Fee</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
                  {paginatedRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30 transition">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">{r.receiptNo}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{r.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Roll: {r.rollNo}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">{r.class}</span> - {r.section}
                      </td>
                      <td className="py-3 px-4 font-medium">{r.month}</td>
                      <td className="py-3 px-4 font-semibold">{formatPKR(r.amount + (r.lateFine || 0))}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{formatPKR(r.paidAmount)}</td>
                      <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">{formatPKR(r.balance)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={r.status.toLowerCase()}>{r.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-[11px]">{r.paymentMethod || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceipt(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                        >
                          Print Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Defaulters List */}
      {activeTab === 'defaulters' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <div>
                <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300">Outstanding Fee Defaulters</h4>
                <p className="text-xs text-rose-700 dark:text-rose-400">Total {defaultersList.length} students have unpaid dues exceeding {formatPKR(totalPending)}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#0A1630] text-[11px] font-bold uppercase text-slate-500 border-b">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Parent Phone</th>
                  <th className="py-3 px-4">Pending Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
                {defaultersList.map((d) => {
                  const student = students.find(s => s.id === d.studentId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-[#12254A]/30">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{d.studentName}</p>
                        <p className="text-[10px] text-slate-400">Roll: {d.rollNo}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold">{d.class}-{d.section}</td>
                      <td className="py-3 px-4 font-mono">{student?.phone || '0300-1234567'}</td>
                      <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">{formatPKR(d.balance)}</td>
                      <td className="py-3 px-4"><Badge variant={d.status.toLowerCase()}>{d.status}</Badge></td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSendReminder(d)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp Notice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Structure & Settings */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Class-wise Tuition Fee Schedule</h3>
            <div className="space-y-2">
              {classes.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A1630] text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPKR(c.monthlyFee)} / month</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Concession & Policy Rules</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630] border">
                <p className="font-bold text-slate-800 dark:text-slate-200">Siblings Discount Policy</p>
                <p className="text-slate-400 mt-0.5">Automated 15% discount applied on the younger sibling tuition fees.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A1630] border">
                <p className="font-bold text-slate-800 dark:text-slate-200">Late Payment Fine</p>
                <p className="text-slate-400 mt-0.5">Rs. 500 late fee surcharge added after the 10th of each calendar month.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      <Modal
        isOpen={isCollectFeeOpen}
        onClose={() => setIsCollectFeeOpen(false)}
        title="Collect Student Fee"
        subtitle="Post cash or digital transaction directly into ledger"
      >
        <form onSubmit={handleCollectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student *
            </label>
            <select
              required
              value={collectData.studentId}
              onChange={(e) => {
                const sId = e.target.value;
                const st = students.find(s => s.id === sId);
                setCollectData({
                  ...collectData,
                  studentId: sId,
                  amount: st ? st.balanceDue || st.monthlyFee : ''
                });
              }}
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
            >
              <option value="">-- Choose student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class}-{s.section}) - Due: {formatPKR(s.balanceDue)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Fee Month</label>
              <select
                value={collectData.month}
                onChange={(e) => setCollectData({ ...collectData, month: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              >
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount Paid (PKR) *</label>
              <input
                type="number"
                required
                min="1"
                value={collectData.amount}
                onChange={(e) => setCollectData({ ...collectData, amount: e.target.value })}
                placeholder="5000"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
              <select
                value={collectData.paymentMethod}
                onChange={(e) => setCollectData({ ...collectData, paymentMethod: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              >
                <option value="Cash">Cash at Counter</option>
                <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Late Fine Surcharge</label>
              <input
                type="number"
                value={collectData.lateFine}
                onChange={(e) => setCollectData({ ...collectData, lateFine: Number(e.target.value) })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
            <input
              type="text"
              value={collectData.remarks}
              onChange={(e) => setCollectData({ ...collectData, remarks: e.target.value })}
              placeholder="e.g. Paid via mobile app / father visited school"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsCollectFeeOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 shadow-md"
            >
              Record Payment & Open Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* Fee Receipt Printable Modal */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title="Fee Receipt Slip"
        subtitle="Official school invoice with accounts stamp"
      >
        <FeeReceipt record={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      </Modal>

      {/* Bulk Challan Vouchers Modal */}
      <Modal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        title="Generate Class Challan Books"
        subtitle="Select grade and section to print fee slips"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class Grade</label>
              <select
                value={voucherClass}
                onChange={(e) => setVoucherClass(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              >
                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Section</label>
              <select
                value={voucherSection}
                onChange={(e) => setVoucherSection(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2F6FDE]"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          <ClassVouchers className={voucherClass} sectionName={voucherSection} onClose={() => setIsVoucherModalOpen(false)} />
        </div>
      </Modal>

      {/* WhatsApp Reminder Preview Modal */}
      <Modal
        isOpen={!!whatsappPreview}
        onClose={() => setWhatsappPreview(null)}
        title="WhatsApp Fee Reminder Preview"
        subtitle="Direct automated alert to parent"
      >
        {whatsappPreview && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>Recipient: {whatsappPreview.phone} ({whatsappPreview.name})</span>
              </div>
              <p className="p-3 bg-white dark:bg-[#0D1B34] rounded-lg border border-emerald-200 dark:border-emerald-900/50 text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                {whatsappPreview.message}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setWhatsappPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success(`WhatsApp reminder sent to ${whatsappPreview.phone}`);
                  setWhatsappPreview(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                Send via Official Gateway
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
