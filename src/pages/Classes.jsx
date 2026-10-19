import React, { useState } from 'react';
import { School, Users, Plus, Edit, Trash2, Printer, ArrowRight, UserCheck } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Modal } from '../components/Modal';
import { ClassVouchers } from '../components/ClassVouchers';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Badge } from '../components/Badge';
import { formatPKR } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Classes = () => {
  const { classes, students, addClass, updateClass, deleteClass, teachers } = useSchool();

  const [selectedClassForVoucher, setSelectedClassForVoucher] = useState(null);
  const [selectedSectionView, setSelectedSectionView] = useState(null); // { className, section }
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Class 11',
    sections: ['A', 'B'],
    monthlyFee: 8000,
    classTeacher: 'Muhammad Tariq',
    roomNo: 'Room 401'
  });

  const handleClassSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      updateClass(editingClass.id, formData);
      toast.success('Class updated successfully');
      setEditingClass(null);
    } else {
      addClass(formData);
      toast.success('New class added to school curriculum');
      setIsAddClassOpen(false);
    }
  };

  // Section view students
  const activeSectionStudents = selectedSectionView
    ? students.filter(s => s.class === selectedSectionView.className && s.section === selectedSectionView.section)
    : [];

  const paidCount = activeSectionStudents.filter(s => s.feeStatus === 'Paid').length;
  const unpaidCount = activeSectionStudents.filter(s => s.feeStatus === 'Unpaid' || s.feeStatus === 'Overdue').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Classes & Academic Sections
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8FA3C4] mt-0.5">
            Manage grade wings, active sections (A, B, C), and assigned faculty mentors
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClass(null);
            setFormData({
              name: 'Class 11',
              sections: ['A', 'B'],
              monthlyFee: 8000,
              classTeacher: teachers[0]?.name || 'Muhammad Tariq',
              roomNo: 'Room 401'
            });
            setIsAddClassOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 text-white shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Grade</span>
        </button>
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const classStudents = students.filter(s => s.class === cls.name);
          const totalInClass = classStudents.length;

          return (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200 dark:border-[#1B2C4D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2F6FDE]">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{cls.name}</h3>
                      <p className="text-xs text-slate-400">{cls.roomNo || 'Wing Block A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingClass(cls);
                        setFormData({ ...cls });
                        setIsAddClassOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(cls.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 py-3 px-3.5 bg-slate-50 dark:bg-[#0A1630] rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Total Students</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{totalInClass} Enrolled</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Tuition Rate</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatPKR(cls.monthlyFee)}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                  <p className="text-slate-400 text-[11px]">Class Incharge:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{cls.classTeacher}</p>
                </div>

                {/* Sections list */}
                <div className="mt-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Sections & Vouchers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cls.sections.map(sec => {
                      const count = classStudents.filter(s => s.section === sec).length;
                      return (
                        <div
                          key={sec}
                          className="flex items-center gap-1.5 p-1.5 pl-2.5 rounded-xl border border-slate-200 dark:border-[#1B2C4D] bg-slate-50/50 dark:bg-[#12254A]/30 text-xs"
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200">Sec {sec}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({count})</span>
                          <button
                            onClick={() => setSelectedSectionView({ className: cls.name, section: sec })}
                            title="View section students"
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedClassForVoucher({ className: cls.name, section: sec })}
                            title="Print Monthly Challans"
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section View Students Modal */}
      <Modal
        isOpen={!!selectedSectionView}
        onClose={() => setSelectedSectionView(null)}
        title={selectedSectionView ? `${selectedSectionView.className} - Section ${selectedSectionView.section}` : 'Section Details'}
        subtitle="Enrolled student roster with instant fee clearance indicators"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center text-xs p-3 bg-slate-50 dark:bg-[#0A1630] rounded-xl border">
            <div>
              <p className="text-slate-400">Total In Section</p>
              <p className="font-bold text-base text-slate-900 dark:text-white">{activeSectionStudents.length}</p>
            </div>
            <div>
              <p className="text-slate-400">Fees Paid</p>
              <p className="font-bold text-base text-emerald-600">{paidCount}</p>
            </div>
            <div>
              <p className="text-slate-400">Fees Pending</p>
              <p className="font-bold text-base text-rose-600">{unpaidCount}</p>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1B2C4D]">
            {activeSectionStudents.map((st) => (
              <div key={st.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={st.photo} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Roll: {st.rollNo} • Ph: {st.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={st.feeStatus.toLowerCase()} size="sm">{st.feeStatus}</Badge>
                  {st.balanceDue > 0 && (
                    <p className="text-[10px] text-rose-600 font-bold mt-0.5">Due: {formatPKR(st.balanceDue)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t">
            <button
              onClick={() => {
                const s = selectedSectionView;
                setSelectedSectionView(null);
                setSelectedClassForVoucher(s);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2F6FDE] hover:bg-blue-600 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print All Challans for Section
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Vouchers Print Modal */}
      <Modal
        isOpen={!!selectedClassForVoucher}
        onClose={() => setSelectedClassForVoucher(null)}
        title="Class Fee Challan Book"
        subtitle="Ready-to-print monthly fee vouchers for all students"
      >
        {selectedClassForVoucher && (
          <ClassVouchers
            className={selectedClassForVoucher.className}
            sectionName={selectedClassForVoucher.section}
            onClose={() => setSelectedClassForVoucher(null)}
          />
        )}
      </Modal>

      {/* Add / Edit Class Modal */}
      <Modal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        title={editingClass ? 'Edit Grade Structure' : 'Add New Class Grade'}
        subtitle="Define class name, tuition fee rate, and assign class teacher"
      >
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Class Grade Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Class 11"
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Tuition Fee (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                placeholder="7500"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room / Wing Number
              </label>
              <input
                type="text"
                value={formData.roomNo || ''}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                placeholder="Room 302"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assign Class Teacher Incharge
            </label>
            <select
              value={formData.classTeacher}
              onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
              className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#0A1630] border border-slate-200 dark:border-[#1B2C4D] p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6FDE]"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsAddClassOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#1E4A94] dark:bg-[#2F6FDE] dark:hover:bg-blue-600 shadow-md"
            >
              {editingClass ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          deleteClass(deleteTargetId);
          toast.success('Class removed');
        }}
        title="Delete Class"
        message="Are you sure you want to delete this class grade? This action cannot be undone."
      />
    </div>
  );
};
