import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  Edit,
  Eye,
  IdCard,
  CreditCard,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Phone,
  CheckCircle,
  Receipt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StudentIDCard } from '../components/StudentIDCard';
import { FeeReceipt } from '../components/FeeReceipt';
import { formatPKR, downloadCSV } from '../utils/helpers';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent, bulkDeleteStudents, classes, collectFee } = useSchool();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [feeStatusFilter, setFeeStatusFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Selection & Bulk Action
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [viewIDCardStudent, setViewIDCardStudent] = useState(null);

  // Quick Fee Collection from Students List
  const [feeModalStudent, setFeeModalStudent] = useState(null);
  const [feeAmount, setFeeAmount] = useState('');
  const [feeMonth, setFeeMonth] = useState('October 2026');
  const [feeMethod, setFeeMethod] = useState('Cash');
  const [feeRemarks, setFeeRemarks] = useState('');
  const [issuedReceipt, setIssuedReceipt] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    gender: 'Male',
    dob: '2012-05-15',
    class: 'Class 9',
    section: 'A',
    rollNo: '',
    phone: '0300-1234567',
    whatsapp: '0300-1234567',
    address: 'Gulberg III, Lahore',
    admissionDate: '2026-10-15',
    monthlyFee: 7000,
    photo: ''
  });

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.class === classFilter;
    const matchesSection = sectionFilter === 'ALL' || s.section === sectionFilter;
    const matchesFee = feeStatusFilter === 'ALL' || s.feeStatus.toLowerCase() === feeStatusFilter.toLowerCase();
    const matchesGender = genderFilter === 'ALL' || s.gender === genderFilter;

    return matchesSearch && matchesClass && matchesSection && matchesFee && matchesGender;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedStudents.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      toast.success('Student profile updated successfully');
      setEditingStudent(null);
    } else {
      addStudent(formData);
      toast.success('Student enrolled successfully');
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fatherName: '',
      gender: 'Male',
      dob: '2012-05-15',
      class: 'Class 9',
      section: 'A',
      rollNo: '',
      phone: '0300-1234567',
      whatsapp: '0300-1234567',
      address: 'Gulberg III, Lahore',
      admissionDate: '2026-10-15',
      monthlyFee: 7000,
      photo: ''
    });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsAddModalOpen(true);
  };

  const handleOpenFeeModal = (student) => {
    setFeeModalStudent(student);
    setFeeAmount(student.balanceDue || student.monthlyFee);
    setFeeRemarks(`Monthly fee payment for ${student.name}`);
  };

  const handleFeeSubmit = (e) => {
    e.preventDefault();
    if (!feeModalStudent || !feeAmount) return;

    const receipt = collectFee({
      studentId: feeModalStudent.id,
      amount: Number(feeAmount),
      paymentMethod: feeMethod,
      month: feeMonth,
      remarks: feeRemarks
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    toast.success(`Fee collected for ${feeModalStudent.name}! Status updated to Paid.`);
    setFeeModalStudent(null);
    setIssuedReceipt(receipt);
  };

  const handleExportCSV = () => {
    const headers = ['id', 'rollNo', 'name', 'fatherName', 'class', 'section', 'phone', 'feeStatus', 'balanceDue'];
    downloadCSV(`Students_Export_${Date.now()}.csv`, filteredStudents, headers);
    toast.success(`Exported ${filteredStudents.length} students to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Students Management & Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Total {students.length} students • Manage enrollment, fees collection, and profiles
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#12254A] transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setEditingStudent(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md shadow-blue-900/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or father name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0A1630] rounded-xl border border-slate-200 dark:border-[#1B2C4D] shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'table' ? 'bg-white dark:bg-[#0D1B34] text-blue-600 shadow-xs' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'grid' ? 'bg-white dark:bg-[#0D1B34] text-blue-600 shadow-xs' : 'text-slate-400'}`}
              title="Cards Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#1B2C4D] text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => { setSectionFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          <select
            value={feeStatusFilter}
            onChange={(e) => { setFeeStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Fee Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {selectedIds.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                {selectedIds.length} selected
              </span>
              <button
                onClick={() => setIsBulkDeleteOpen(true)}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-[#0A1630] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8FA3C4] border-b border-slate-200 dark:border-[#1B2C4D]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={paginatedStudents.length > 0 && selectedIds.length === paginatedStudents.length}
                      className="rounded border-slate-300 text-[#2F6FDE] focus:ring-[#2F6FDE]"
                    />
                  </th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Class & Sec</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1B2C4D]">
                {paginatedStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-[#12254A]/30 transition">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(st.id)}
                        onChange={() => handleToggleSelect(st.id)}
                        className="rounded border-slate-300 text-[#2F6FDE] focus:ring-[#2F6FDE]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.photo}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p
                            onClick={() => navigate(`/students/${st.id}`)}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                          >
                            {st.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{st.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">{st.rollNo}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{st.class}</span>
                      <span className="ml-1 text-[11px] text-slate-400">({st.section})</span>
                    </td>
                    <td className="py-3 px-4">{st.fatherName}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">{st.phone}</td>
                    <td className="py-3 px-4">
                      <Badge variant={st.feeStatus.toLowerCase()}>
                        {st.feeStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1-Click Collect / Maintain Fee Record Button */}
                        <button
                          onClick={() => handleOpenFeeModal(st)}
                          title="Collect / Maintain Fee Record"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Fee</span>
                        </button>
                        <button
                          onClick={() => setViewIDCardStudent(st)}
                          title="Generate ID Card"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/students/${st.id}`)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(st)}
                          title="Edit Student"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(st.id)}
                          title="Delete Student"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedStudents.map((st) => (
            <div
              key={st.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <Badge variant={st.feeStatus.toLowerCase()} size="sm">
                    {st.feeStatus}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400">{st.rollNo}</span>
                </div>

                <div className="flex flex-col items-center text-center mt-3 mb-2">
                  <img
                    src={st.photo}
                    alt={st.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-[#1B2C4D] shadow-sm mb-2"
                  />
                  <h4
                    onClick={() => navigate(`/students/${st.id}`)}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                  >
                    {st.name}
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{st.class} - Sec {st.section}</p>
                </div>

                <div className="space-y-1 text-xs text-slate-500 dark:text-[#8FA3C4] border-t border-slate-100 dark:border-[#1B2C4D] pt-2">
                  <p><strong>Father:</strong> {st.fatherName}</p>
                  <p className="flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" /> {st.phone}
                  </p>
                  <p className="text-slate-400">Monthly Fee: <strong className="text-slate-700 dark:text-slate-200">{formatPKR(st.monthlyFee)}</strong></p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-[#1B2C4D]">
                <button
                  onClick={() => handleOpenFeeModal(st)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1"
                >
                  <CreditCard className="w-3 h-3" /> Collect Fee
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewIDCardStudent(st)}
                    className="p-1 rounded text-slate-400 hover:text-blue-500"
                    title="ID Card"
                  >
                    <IdCard className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleEdit(st)}
                    className="p-1 rounded text-slate-400 hover:text-amber-500"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(st.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#8FA3C4]">
        <p>
          Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#1B2C4D] bg-white dark:bg-[#0D1B34] text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 rounded-xl font-bold transition ${currentPage === num ? 'bg-[#0B2A5B] dark:bg-[#2F6FDE] text-white shadow-xs' : 'border border-slate-200 dark:border-[#1B2C4D] bg-white dark:bg-[#0D1B34] text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
            >
              {num}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#1B2C4D] bg-white dark:bg-[#0D1B34] text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collect / Maintain Fee Modal */}
      <Modal
        isOpen={!!feeModalStudent}
        onClose={() => setFeeModalStudent(null)}
        title={feeModalStudent ? `Maintain Fee Record: ${feeModalStudent.name}` : 'Collect Fee'}
        subtitle="Post installment or full month clearance directly into ledger"
      >
        {feeModalStudent && (
          <form onSubmit={handleFeeSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-[#0A1630] rounded-xl border text-xs grid grid-cols-2 gap-2">
              <div>
                <p className="text-slate-400">Class & Section:</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{feeModalStudent.class} - {feeModalStudent.section}</p>
              </div>
              <div>
                <p className="text-slate-400">Current Balance Due:</p>
                <p className="font-bold text-rose-600 dark:text-rose-400">{formatPKR(feeModalStudent.balanceDue)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Fee Month</label>
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
              <label className="block text-xs font-semibold mb-1">Remarks / Note</label>
              <input
                type="text"
                value={feeRemarks}
                onChange={(e) => setFeeRemarks(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border p-2.5"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setFeeModalStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                Confirm Payment & Generate Receipt
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Instant Receipt Slip Modal */}
      <Modal
        isOpen={!!issuedReceipt}
        onClose={() => setIssuedReceipt(null)}
        title="Official Fee Receipt"
        subtitle="Electronic proof of payment generated"
      >
        <FeeReceipt record={issuedReceipt} onClose={() => setIssuedReceipt(null)} />
      </Modal>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingStudent ? 'Edit Student Details' : 'Enroll New Student'}
        subtitle="Complete admission profile with bio-data and contact details"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Muhammad Hamza"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Father / Guardian Name *
              </label>
              <input
                type="text"
                required
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="Tariq Mehmood"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class *
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              >
                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Section *
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0300-1234567"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="0321-9876543"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Tuition Fee (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                placeholder="7000"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House #12, Street 4, Lahore"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1B2C4D]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 shadow-md shadow-blue-500/20"
            >
              {editingStudent ? 'Save Changes' : 'Confirm Enrollment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteStudent(deleteTargetId);
            toast.success('Student record deleted');
          }
        }}
        title="Delete Student"
        message="Are you sure you want to permanently delete this student? All linked fee challans and records will be deleted."
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={() => {
          bulkDeleteStudents(selectedIds);
          setSelectedIds([]);
          toast.success(`Deleted ${selectedIds.length} students`);
        }}
        title="Delete Multiple Students"
        message={`Are you sure you want to permanently remove all ${selectedIds.length} selected students?`}
      />

      {/* Student ID Card Modal */}
      <Modal
        isOpen={!!viewIDCardStudent}
        onClose={() => setViewIDCardStudent(null)}
        title="Printable Student Identity Card"
        subtitle="Institutional smart student card ready for color printing"
      >
        <StudentIDCard student={viewIDCardStudent} onClose={() => setViewIDCardStudent(null)} />
      </Modal>
    </div>
  );
};
